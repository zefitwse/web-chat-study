import React, { memo } from "react";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex"; // 使用 Katex
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css"; // 引入 Katex 样式
import "highlight.js/styles/github.css"; 

import "./index.less";

const MarkdownArea = ({ result }) => {
  return (
    <div className="self-markdown-table">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]} // 使用 Katex 渲染器
        // components={{
        //   code({ node, className, children, ...props }) {
        //     const match = /language-(\w+)/.exec(className || "");
        //     return  match ? (
        //       <pre>
        //         <code className={className} {...props}>
        //           {String(children).replace(/\n$/, "")}
        //         </code>
        //       </pre>
        //     ) : (
        //       <code className={className} {...props}>
        //         {children}
        //       </code>
        //     );
        //   },
        // }}
      >
        {result}
      </ReactMarkdown>
    </div>
  );
};

export default memo(MarkdownArea);
