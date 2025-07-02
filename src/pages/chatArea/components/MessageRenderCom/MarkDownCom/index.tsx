import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import './index.less' // 👈 引入样式


const markdown = `
# 📝 Markdown 示例

这是普通文字，**加粗**，<i>斜体State</i>，~~删除线~~，<u>下划线</u>，<mark>文本高亮</mark>，文本^上标^，文本~下标~，<small>小号字体</small>，<big>大号字体</big>，<sub>下标</sub>，<sup>上标</sup>，<q>引文</q>。

---

## ✅ 列表支持

- 项目 1
- 项目 2
- [链接示例](https://reactjs.org)

---

## ✅ 表格支持

| 名字 | 年龄 |
|------|------|
| 张三 | 20   |
| 李四 | 30   |

- [x] 已完成任务
- [ ] 待完成任务
`;

const MarkdownArea = () => {
  return (
    <div style={{ padding: "20px", lineHeight: "1.6" }} className="markdown-table">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 style={{ color: "#007acc" }} {...props} />
          ),
          u: ({ node, ...props }) => (
            <u style={{ color: "purple" }} {...props} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default memo(MarkdownArea);
