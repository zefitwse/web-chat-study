import React from "react";
import TypeWriteFlowCom from "../components/TypeWriteFlowCom";
import UserChatBubbleCom from "../components/UserChatBubbleCom";
import MarkDownCom from "../components/MarkDownCom";
import "./index.less";

const QAChatCom = (props: any) => {
  return (
    <>
      {props.messageArr.map((item: any) => {
        if (item.role === "user") {
          // 返回用户输入的内容，并渲染为气泡
          return (
            <UserChatBubbleCom
              messageItem={item}
              key={item.id}
            ></UserChatBubbleCom>
          );
        } else if (item.streaming) {
          // 返回模型正在回答的答案，并渲染成气泡
          return (
            <TypeWriteFlowCom
              chunkText={item.partialText}
              key={item.id}
            ></TypeWriteFlowCom>
          );
        } else {
          // 返回模型之前回答过的答案，并渲染成气泡
          return (
            <div key={item.id} className="answer-message">
              <MarkDownCom result={item?.result}></MarkDownCom>
            </div>
          );
        }
      })}
    </>
  );
};

export default QAChatCom;
