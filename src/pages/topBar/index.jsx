import React from "react";
import { Avatar, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../stores/themeSlice.ts";

import "./index.less";

const TopBar = () => {
  const isDark = useSelector((state) => state.theme.isDark);
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
