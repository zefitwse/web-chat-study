import { useEffect, useState, useRef } from "react";

const TypeWriteFlowCom = ({ text }) => {
  const [textContent, setTextContent] = useState("");
  const index = useRef(0);               // 下一个打印字符索引
  const timerRef = useRef(null);
  const prevTextLength = useRef(0);     // 记录上次 text 长度

  useEffect(() => {
    // 如果新 text 比旧 text 短，重置（可能是重置场景）
    if (text.length < prevTextLength.current) {
      setTextContent("");
      index.current = 0;
    }
    prevTextLength.current = text.length;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (index.current < text.length) {
        // 取当前字符
        const charToAdd = text[index.current];
        // 追加到内容
        setTextContent((prev) => prev + charToAdd);
        index.current += 1;
      } else {
        // 打完了，清理定时器
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text]);

  return <div>{textContent}</div>;
};

export default TypeWriteFlowCom;
