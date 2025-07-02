import { useEffect, useState, useRef } from "react";
import './index.less'

const TypeWriteFlowCom = ({ chunkText }) => {
  const [textContent, setTextContent] = useState("");

  const fullText = useRef("");
  const index = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (chunkText) {
      fullText.current += chunkText;
    }

    timerRef.current = setInterval(() => {
      if (index.current < fullText.current.length) {
        const nextChar = fullText.current.charAt(index.current);
        setTextContent(prev => prev + nextChar);
        index.current++;
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chunkText]);

  return <div className="answer-message">{textContent}</div>;
};

export default TypeWriteFlowCom;
