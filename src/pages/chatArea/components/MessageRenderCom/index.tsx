import React, { memo } from "react";
import MarkDownCom from "./MarkDownCom";

const MessageRenderCom = () => {
  return <>
  <MarkDownCom></MarkDownCom>
  </>;
};

export default memo(MessageRenderCom);
