import React, { useEffect, useRef } from "react";
import { Button, Input, Form } from "antd";
import { ArrowUpOutlined, StopOutlined } from "@ant-design/icons";
import QAChatCom from "./QAChatCom/index";
import { useDispatch, useSelector } from "react-redux";
import {
  insertQAMessageToStore,
  appendAnswerToStore,
  initMessageArr,
} from "../../stores/messageSlice";
import { sendQuestion } from "../../fetchApi/request";
import {
  QAInsertDB,
  AnswerContinueInsertDB,
  AnswerInsertFinish,
  getAllMessages,
} from "../../utils";
import "./index.less";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const { TextArea } = Input;

const ChatAreaCom = () => {
  const [form] = Form.useForm();

  // const [answerText, setAnswerText] = useState({}); // 接收到的回答
  const sending = useRef(false); // 按钮发送loading

  const controllerRef = useRef<AbortController | any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 用store来维护UI层的聊天记录
  const dispatch = useDispatch();
  const messageArr = useSelector((state: any) => state.message.messageArr);

  const send = async () => {
    sending.current = true;
    // 获取用户的输入值
    const value = form.getFieldValue("userPrompt");
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

    try {
      const res: any = await sendQuestion(value); // 调用封装的 fetch 接口
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let tempId = Date.now();
      let tempText = "";
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

      await QAInsertDB(value, "GPT", answerMessageObj);
      dispatch(insertQAMessageToStore(answerMessageObj));

      while (true) {
        const { done, value } = await reader.read();

        // 如果流结束了，则标记输出完毕
        if (done) {
          // 讲之后的流式输出，追加put到库里
          AnswerInsertFinish(answerMessageObj, tempText);
          // store做对应的处理
          dispatch(
            appendAnswerToStore({
              id: tempId,
              tempText,
              end: true,
            })
          );
          break;
        }
        const chunk = JSON.parse(decoder.decode(value)).data;
        // ai的回答可能会过长，这时候会用流式分chunk输出给前端。这里是把之后的流式输出，追加put到库里
        await AnswerContinueInsertDB(answerMessageObj, tempText, chunk);
        dispatch(
          appendAnswerToStore({
            id: tempId,
            tempText,
            end: false,
            chunk,
          })
        );
        tempText = tempText + chunk;
      }
    } catch (err) {
      console.error("获取答案失败:", err);
    } finally {
      sending.current = false;
    }
  };

  const initMessage = async () => {
    let res = await getAllMessages("message");
    dispatch(initMessageArr(res));
  };


useEffect(() => {

  const el = containerRef.current;
  if (el) {
    console.log('gundong')
    el.scrollTop = el.scrollHeight;
  }
}, [messageArr.length]);

  useEffect(() => {
    initMessage();
  }, []);

  return (
    <div className="chat-container">
      <div ref={containerRef} className="output-area">
        <div  className="answer-container">
          <QAChatCom  messageArr={messageArr}></QAChatCom>
        </div>
      </div>

      {/* 用户输入区域 */}
      <div className="input-area">
        <Form form={form}>
          <Form.Item style={{marginBottom:0}} label="" name="userPrompt">
            <TextArea
              placeholder="请输入"
              allowClear
              autoSize={{ minRows: 2, maxRows: 6 }}
              className="self-textarea"
            />
          </Form.Item>
          <div className="self-button">
          {sending.current ? (
            <Button
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
              shape="circle"
              icon={<ArrowUpOutlined />}
              onClick={send}
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
