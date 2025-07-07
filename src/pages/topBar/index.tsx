import React from "react";
import { Avatar, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../stores/themeSlice.js";

import "./index.less";

const TopBar: React.FC = () => {
  const isDark = useSelector((state: any) => state.theme.isDark);
  const dispatch = useDispatch();

  const changeThemeMode = () => {
    dispatch(changeTheme(!isDark));
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
            {!isDark ? "切换夜间" : "切换白天"}
          </Button>
          <Avatar className="avator"></Avatar>
        </div>
      </header>
    </div>
  );
};

export default TopBar;
