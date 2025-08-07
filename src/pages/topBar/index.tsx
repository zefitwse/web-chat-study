import React from "react";
import { Avatar, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../stores/themeSlice.js";
import { clearMessagesTable } from "../../utils/index.js";

import "./index.less";

const TopBar: React.FC = () => {
  const isDark = useSelector((state: any) => state.theme.isDark);
  const dispatch = useDispatch();

  const changeThemeMode = () => {
    dispatch(changeTheme(!isDark));
  };

  const clearIndexDB = async () => {
    await clearMessagesTable();
    window.location.reload();
  };

  return (
    <div className="topbar">
      <header className="header">
        <div className="title">
          <h2>My Rag</h2>
          <Button
            type="default"
            shape="round"
            style={{ margin: 10 }}
            onClick={clearIndexDB}
          >
            清除聊天记录
          </Button>
        </div>

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
