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
  {
    key: "111231",
    label: "查询今天提前",
  },
  {
    key: "22123432342",
    label: "查询今天提前",
  },
  {
    key: "267867822226786782",
    label: "查询今天提前",
  },
  {
    key: "26786786999786782",
    label: "查询今天提前",
  },
  {
    key: "267867867862",
    label: "查询今天提前",
  },
  {
    key: "26786784642",
    label: "查询今天提前",
  },
  {
    key: "222",
    label: "查询今天提前",
  },
  {
    key: "22342",
    label: "查询今天提前",
  },
  {
    key: "25672",
    label: "查询今天提前",
  },
  {
    key: "2567562",
    label: "查询今天提前",
  },
  {
    key: "26786782",
    label: "查询今天提前",
  },
  {
    key: "326786786782",
    label: "查询今天提前",
  },
  {
    key: "26786786782",
    label: "查询今天提前",
  },
  {
    key: "276867867867862",
    label: "查询今天提前",
  },
];

const SideBar = () => {
  const [menuList, setMemuList] = useState(items);
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
