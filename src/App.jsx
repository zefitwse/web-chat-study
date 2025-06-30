import React from "react";
import ChatAreaCom from "./pages/chatArea";
import SideBar from "./pages/sideBar";
import TopBar from "./pages/topBar";

import "./App.less";

function App() {
  return (
    <>
      <div className="app-container">
        <header className="header">
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
