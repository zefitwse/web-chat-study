import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { NavLink, Outlet, useLocation } from "react-router-dom";
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "create",
    label: "创建新聊天",
  },
  {
    key: "search",
    label: "搜索聊天",
  },

  {
    type: "divider",
  },
];

const SideBar = () => {
  const [menuList, setMemuList] = useState(items);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  useEffect(() => {
    const res = [
      {
        key: "sub1",
        label: "Navigation One",
      },
      {
        key: "sub2",
        label: "Navigation Two",
      },

      {
        key: "sub4",
        label: "Navigation Three",
      },
    ];
    setMemuList([...menuList, ...res]);
  }, []);

  return (
    <div style={{ width: 256 }}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 10 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="menu-action"></div>
      <div className="chat-list">
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          inlineCollapsed={collapsed}
          items={menuList.map((item: any) => {
            return {
              key: item.key,
              label: <NavLink to={item.key}>{item.label}</NavLink>,
              type: item.type,
            };
          })}
        />
      </div>
    </div>
  );
};

export default SideBar;
