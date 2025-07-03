import React from "react";
import TypeWriteFlowCom from "../components/TypeWriteFlowCom";
import UserChatBubbleCom from "../components/UserChatBubbleCom";
import './index.less'

const QAChatCom = (props: any) => {
  return (
    <>
      {props.messageArr.map((item: any) => {
        if (item.role === "user") {
          return  <UserChatBubbleCom messageItem={item} key={item.id}></UserChatBubbleCom>;
        }else if(item.streaming){
          return <TypeWriteFlowCom chunkText={item.partialText} key={item.id}></TypeWriteFlowCom>
        } else{
          return <div key={item.id} className="answer-message">{item.result}</div>;
        }
      })}
    </>
  );
};

export default QAChatCom;
