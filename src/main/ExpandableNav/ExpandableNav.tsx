import React from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
} from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";
import "./ExpandableNav.scss";

const defaultData = [
  {
    title: "Food",
    type: "artifact",
    children: [
      { title: "Egg", type: "asset" },
      { title: "Burger", type: "asset" },
      { title: "Salad", type: "asset" },
    ],
  },
  {
    title: "Drink",
    type: "artifact",
    children: [
      {
        title: "Milk",
        type: "asset",
        children: [
          { title: "Soy", type: "asset" },
          { title: "Cow", type: "asset" },
        ],
      },
      { title: "Water", type: "asset" },
    ],
  },
];

const defaultDataEasy: any = [
  {
    title: "Food",
    type: "artifact",
  },
  {
    title: "Drink",
    type: "artifact",
  },
];

const defaultDataMulti: any = [
  {
    title: "Food",
    type: "artifact",
    children: [
      { title: "Egg", type: "asset" },
      { title: "Burger", type: "asset" },
      { title: "Salad", type: "asset" },
    ],
  },
];

const generateChildren = (data) => {
  if (!data.children || !data.children.length) {
    return <MenuItem key={data.title}>{data.title}</MenuItem>;
  }

  return (
    <SubMenu title={data.title} key={data.title}>
      {data.children.map((child) => generateChildren(child))}
    </SubMenu>
  );
};

export default function ExpandableNav() {
  return (
    <ProSidebar>
      <SidebarHeader>
        <h4>Header</h4>
      </SidebarHeader>
      <Menu popperArrow={true}>
        {defaultData.map((data) => {
          return generateChildren(data);
        })}
      </Menu>
    </ProSidebar>
  );
}
