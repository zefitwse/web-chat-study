import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import "./index.less";

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
  const onClick: MenuProps["onClick"] = (e) => {
  };

  useEffect(() => {
    const res = [
      {
        key: "sub1",
        label: "专线运营能力出错",
      },
      {
        key: "sub2",
        label: "帮我查询一下丢包率",
      },

      {
        key: "sub4",
        label: "为什么这个延迟那么高",
      },
    ];
    setMemuList([...menuList, ...res]);
  }, []);

  return (
    <div>
      <div className="sidebar-contianer">
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
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
