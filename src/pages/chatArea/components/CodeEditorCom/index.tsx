import React from "react";
import Editor from "@monaco-editor/react";
import './index.less'

const CodeEditor = () => {
  return (
    <div>
      <Editor
        className="code-edit"
        height="400px"
        defaultLanguage="javascript"
        defaultValue={`function hello() {\n  console.log("Hello world!");\n}`}
        theme="vs-dark"
        onChange={(value) => {
          console.log("Code:", value);
        }}
        options={{
            readOnly: true,         // ✅ 设置只读
            minimap: { enabled: false },
            lineNumbers: 'on',
            fontSize: 14,
          }}
      />
    </div>
  );
};

export default CodeEditor;
