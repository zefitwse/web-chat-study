import React, { useState } from "react";
import "./index.less";
import { CopyOutlined } from "@ant-design/icons";

const UserChatBubbleCom = (props: any) => {
  const { messageItem } = props;
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="message-card-container">
        <div>{messageItem.input}</div>
        <div
          onClick={() => {
            navigator.clipboard
              .writeText((messageItem.input).trim())
          }}
          className={`clip-edit-area ${hover ? "show" : ""}`}
        >
          <CopyOutlined />
        </div>
      </div>
    </div>
  );
};

export default UserChatBubbleCom;
