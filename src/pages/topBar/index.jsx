import React, { useState } from "react";
import { Avatar, Button } from "antd";

import "./index.less";

const TopBar = () => {
  const [themeLight, setThemeLight] = useState(false);

  const changeThemeMode = () => {
    setThemeLight(!themeLight);
    document.documentElement.classList.toggle("theme-dark");
  };

  return (
    <div className="topbar">
      <header className="header">
        <h2>My Rag</h2>
        <div>
          <Button
            className="theme-button"
            type="default"
            shape="round"
            onClick={changeThemeMode}
          >
            {!themeLight ? "切换夜间" : "切换白天"}
          </Button>
          <Avatar className="avator"></Avatar>
        </div>
      </header>
    </div>
  );
};

export default TopBar;
