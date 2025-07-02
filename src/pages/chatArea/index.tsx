import React, { useEffect, useState, useRef } from "react";
import { Button, Input } from "antd";
import MessageRenderCom from "./components/MessageRenderCom";
import CodeEditor from "./components/CodeEditorCom";
import TypeWriteFlowCom from "./components/TypeWriteFlowCom";
import { sendQuestion } from "../../fetchApi/request";
import "./index.less";
import { NavLink, Outlet, useLocation } from "react-router-dom";
const ChatAreaCom = () => {
  const [answerText, setAnswerText] = useState(""); // 接收到的回答

  // const controllerRef = useRef<AbortController | any>(null);
  // controllerRef.current = new AbortController(); // 保存 AbortController 实例

  const getAnswer = async () => {
    try {
      const res: any = await sendQuestion("aaa");// 调用封装的 fetch 接口
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = JSON.parse(decoder.decode(value)).data
        setAnswerText(chunk); // 或者累加展示
        // console.log(chunk,'wohsi chunk')
      }
    } catch (err) {
      console.error("获取答案失败:", err);
    }
  };

  useEffect(() => { }, []);

  return (
    <div className="chat-content">
      <div className="output-area">
        <TypeWriteFlowCom text={answerText}></TypeWriteFlowCom>
        <MessageRenderCom></MessageRenderCom>
        <CodeEditor></CodeEditor>
      </div>

      <div className="input-area">
        <Input></Input>
        <Button onClick={getAnswer}>发送</Button>
        <Button
          onClick={() => {
            // if (controllerRef.current) {
            //   controllerRef.current.abort(); // AbortController 实例有 abort 方法
            // }
          }}
        >
          终止
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default ChatAreaCom;
