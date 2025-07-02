import React, { useState } from "react";
import TypeWriteFlowCom from "../components/TypeWriteFlowCom";
import MarkDownCom from "../components/MarkDownCom";
import CodeEditor from "../components/CodeEditorCom";
import UserChatBubbleCom from "../components/UserChatBubbleCom";

const QAChatCom = (props: any) => {
  const [chatRecord, setChatRecord] = useState([]);
  console.log(props.messageArr, "messageArr");
  return (
    <>
      {props.messageArr.map((item: any) => {
        if (item.role === "user") {
          return  <UserChatBubbleCom messageItem={item} key={item.id}></UserChatBubbleCom>;
        }else{
          return <TypeWriteFlowCom chunkText={item.partialText} key={item.id}></TypeWriteFlowCom>
        }
      })}
    </>
  );
};

export default QAChatCom;
