import React, { useEffect } from "react";
import ChatAreaCom from "./pages/chatArea";
import SideBar from "./pages/sideBar";
import TopBar from "./pages/topBar";



import { useDispatch } from "react-redux";
import { changeTheme } from "./stores/themeSlice.ts";

import "./App.less";

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    dispatch(changeTheme(isDark))
  },[])

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <TopBar></TopBar>
        </header>
        <section className="section">
          <div className="side-container">
            <SideBar></SideBar>
          </div>
          <div className="char-container">
            <ChatAreaCom></ChatAreaCom>
          </div>
        </section>
        <footer className="footer">关于我们</footer>
      </div>
    </>
  );
}

export default App;
