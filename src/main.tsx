import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./stores/index";
import { ConfigProvider, theme } from "antd";

import App from "./App.jsx";

import "./theme/light.css";
import "./theme/dark.css";
import "./theme/index.css";

// ✅ 封装一个组件来使用 useSelector
const RootApp: React.FC = () => {
  const isDark = useSelector((state: any) => state.theme.isDark);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
        },
      }}
    >
      <App />
    </ConfigProvider>
  );
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <RootApp />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
