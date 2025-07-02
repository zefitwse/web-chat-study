import React from "react";
import "./index.less";

const UserChatBubbleCom = (props: any) => {
  const { messageItem } = props;

  return (
    <>
      <div className="message-card-container">{messageItem.input}</div>
    </>
  );
};

export default UserChatBubbleCom;
