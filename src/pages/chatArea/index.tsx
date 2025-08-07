import React, { useEffect, useRef, useState } from "react";
import { useOnceEffect } from "../../utils/tools";
import { Button, Input, Form } from "antd";
import {
  ArrowUpOutlined,
  StopOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import QAChatCom from "./QAChatCom/index";
import { useDispatch, useSelector } from "react-redux";
import {
  insertQAMessageToStore,
  appendAnswerToStore,
  initMessageArr,
} from "../../stores/messageSlice";
import { postChat } from "../../fetchApi/chatApi";
import {
  QAInsertDB,
  AnswerContinueInsertDB,
  AnswerInsertFinish,
  getAllMessages,
  updateDB,
} from "../../utils";
import "./index.less";
import { Outlet } from "react-router-dom";

const { TextArea } = Input;

let userInfo = {
  agentId: "",
  userApiKey: "",
};

let prompt1 =
  "假如你的答案有数学内容，请你：- 所有公式都必须用 LaTeX 表达；- 块级公式请用 `$$...$$` 包裹；- 行内公式请用 `$...$` 包裹；- 不要使用 `[` 或 `(` 这样的语法；- 确保 KaTeX 能正确解析,并且在回答里，不要跟我强调我对你做了此条prompt。";

const ChatAreaCom = () => {
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const [sending, setSending] = useState(false); // 按钮发送loading
  const [waitingAnswer, setWaitingAnswer] = useState(false); // 按钮发送loading

  const controllerRef = useRef<AbortController | any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 用store来维护UI层的聊天记录
  const dispatch = useDispatch();
  const messageArr = useSelector((state: any) => {
    return state.message.messageArr;
  });

  const onFinish = async (values: any) => {
    setSending(true);
    setWaitingAnswer(true);

    // 获取用户的输入值
    const value = values.userQuestion;
    if (!value) {
      return;
    }

    form.setFieldValue("userQuestion", "");

    // 创建终止signal
    controllerRef.current = new AbortController();

    let userQuestionObj = {
      id: Date.now(),
      role: "user",
      input: value,
      createdAt: Date.now(),
    };
    // 入库。用indexDB来维护持久层的聊天记录
    await QAInsertDB(userQuestionObj, "user");

    // 入store
    dispatch(insertQAMessageToStore(userQuestionObj));

    let data = {
      chatId: "",
      query: prompt1 + value,
      stream: true,
    };

    let tempId = Date.now();
    let tempText = "";
    try {
      const res: any = await postChat(
        userInfo,
        data,
        controllerRef.current.signal
      ); // 调用封装的 fetch 接口

      setWaitingAnswer(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let answerMessageObj = {
        id: tempId,
        role: "assistant",
        type: "textual",
        sql: "",
        result: null,
        partialText: "", //  增加这个字段做流式显示
        streaming: true, //  表示它还没完成
        createdAt: tempId,
      };
      let buffer = ""; // 保存未处理的字符串
      // 把用户的提问插入数据库，然后存入redux
      await QAInsertDB(value, "GPT", answerMessageObj);
      dispatch(insertQAMessageToStore(answerMessageObj));

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            processLine(buffer);
          }
          AnswerInsertFinish(answerMessageObj, tempText);
          dispatch(
            appendAnswerToStore({
              id: tempId,
              tempText,
              end: true,
            })
          );
          break;
        }

        // 解码 allAnswer 并拼到 buffer 里（stream: true 处理多字节字符）
        buffer += decoder.decode(value, { stream: true });

        // 按换行符分割，除了最后一行都可以处理
        const lines = buffer.split("\n");

        // 保留最后一行，可能是不完整的
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          processLine(line);
        }
      }

      function processLine(line: string) {
        const cleaned = line.replace(/^data:/, "").trim();
        if (!cleaned) return;

        let parsed: any;
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          // console.warn("JSON parse error:", cleaned);
          return;
        }

        const chunk = parsed?.answer ?? "";
        if (!chunk) return;

        tempText = chunk;

        AnswerContinueInsertDB(answerMessageObj, tempText, chunk);

        dispatch(
          appendAnswerToStore({
            id: tempId,
            tempText,
            end: false,
            chunk,
          })
        );
      }
    } catch (err) {
      if (err.name === "AbortError") {
        // 数据库里最后一条信息要处理一下。
        let obj = {
          id: tempId,
          createdAt: tempId,
          partialText: null,
          result: tempText,
          role: "assistant",
          sql: "",
          streaming: false,
          type: "textual",
        };
        await updateDB("messages", obj);
      }
    } finally {
      setSending(false);
    }
  };

  const initMessage = async () => {
    let res = await getAllMessages("messages");
    dispatch(initMessageArr(res));
  };

  const scrollBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useOnceEffect(
    () => {
      scrollBottom();
    },
    messageArr.length,
    (length) => length > 0
  );

  // 滚动底部的button的观察器
  useEffect(() => {
    initMessage();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting); // 关键：是否在视口中
      },
      {
        root: null, // 相对于视口
        threshold: 0.1, // 元素 10% 可见就触发
      }
    );
    const el = bottomRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  return (
    <div className="chat-container">
      <div ref={containerRef} className="output-area">
        <div className="answer-container">
          <QAChatCom messageArr={messageArr}></QAChatCom>
          {waitingAnswer && (
            <div>
              <div className="tempAnswerArea">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            </div>
          )}
          <div style={{ height: 60 }} ref={bottomRef}></div>
        </div>
      </div>

      {/* 用户输入区域 */}
      <div className="input-area">
        {/* 滚动到最底部 */}
        {!isVisible && (
          <Button
            className="scroll-button"
            shape="circle"
            onClick={() => {
              scrollBottom();
            }}
          >
            <ArrowDownOutlined />
          </Button>
        )}
        <Form
          form={form}
          onFinish={onFinish}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isComposing) {
              e.preventDefault(); // 阻止换行
              form.submit(); // 提交表单
            }
          }}
        >
          <Form.Item style={{ marginBottom: 0 }} label="" name="userQuestion">
            <TextArea
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="请输入"
              allowClear
              autoSize={{ minRows: 2, maxRows: 6 }}
              className="self-textarea"
            />
          </Form.Item>
          <div className="self-button">
            {sending ? (
              <Button
                className="button"
                shape="circle"
                icon={<StopOutlined />}
                onClick={() => {
                  if (controllerRef.current) {
                    controllerRef.current.abort(); // AbortController 实例有 abort 方法
                  }
                }}
              ></Button>
            ) : (
              <Button
                className="button"
                htmlType="submit"
                shape="circle"
                icon={<ArrowUpOutlined />}
              ></Button>
            )}
          </div>
        </Form>
      </div>
      <Outlet />
    </div>
  );
};

export default ChatAreaCom;
