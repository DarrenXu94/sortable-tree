import React, { useState } from "react";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";
// import FileExplorerTheme from "react-sortable-tree-theme-minimal";
import FileExplorerTheme from "./main";

import "../theme.min.css";

import "./SortableTree.scss";
import ExpandableNav from "./ExpandableNav/ExpandableNav";

export default function FunctionalApp() {
  const [newNodeName, setnewNodeName] = useState("");

  const [treeData, settreeData] = useState<any>([
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
  ]);

  const myChangeHandler = (event) => {
    setnewNodeName(event.target.value);
  };

  const mySubmitHandler = (event) => {
    event.preventDefault();
    // const newTree = treeData.concat({title: newNodeName})
    const localTree = [...treeData];

    localTree.push({ title: newNodeName, children: [] });
    settreeData(localTree);
  };

  return (
    <div>
      <div className="container">
        <div style={{ paddingBottom: "1rem" }}>
          <ExpandableNav />
        </div>
        <div style={{ height: "100vh" }}>
          <form onSubmit={mySubmitHandler}>
            <p>Add another node</p>
            <input type="text" onChange={myChangeHandler} />
            <input type="submit" />
          </form>
          <SortableTree
            theme={FileExplorerTheme}
            treeData={treeData}
            // canDrag={false}
            onChange={(t) => settreeData(t)}
            canNodeHaveChildren={(node) => node.type === "artifact"}
            generateNodeProps={(rowInfo) => {
              console.log({ rowInfo });
              return {
                title: (
                  <span
                    style={{
                      fontWeight: rowInfo.parentNode ? "normal" : "bold",
                    }}
                  >
                    {rowInfo.node.title}
                  </span>
                ),
              };
            }}
            canDrop={(props) => {
              if (props.node.type == "artifact") {
                if (
                  props.nextParent !== null &&
                  props.nextParent.type == "artifact"
                ) {
                  return false;
                } else {
                  return true;
                }
              }

              return (
                props.nextParent !== null && props.nextParent.type != "asset"
              );
            }}
            //   canDrag={(props) => {
            //     return props.node.type == "asset";
            //   }}
            //   canDrop={({ nextParent }) =>
            //     nextParent !== null && nextParent.type !== "asset"
            //   }
          />
        </div>
      </div>
    </div>
  );
}
