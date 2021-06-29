import React, { useEffect, useState } from "react";
import SortableTree, { changeNodeAtPath } from "react-sortable-tree";
import "react-sortable-tree/style.css";
// import FileExplorerTheme from "react-sortable-tree-theme-minimal";
import FileExplorerTheme from "./main";

import "../theme.min.css";

import "./SortableTree.scss";
import ExpandableNav from "./ExpandableNav/ExpandableNav";

const ParentRow = ({ rowInfo, treeData, settreeData }) => {
  const getNodeKey = ({ treeIndex }) => treeIndex;

  const [isEditing, setisEditing] = useState(false);

  const onChangeExpand = (isCurrentlyExpanded) => {
    const localTree = changeNodeAtPath({
      treeData: treeData,
      path: rowInfo.path,
      getNodeKey,
      newNode: { ...rowInfo.node, expanded: !isCurrentlyExpanded },
    });
    settreeData(localTree);
  };

  if (!rowInfo || !rowInfo.node) return <></>;
  return (
    <div
      style={{
        fontWeight: "bold",
        // background: "gray",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        {isEditing ? (
          <input
            style={{ fontSize: "1.1rem" }}
            value={rowInfo.node.title}
            onChange={(event) => {
              const name = event.target.value;

              const localTree = changeNodeAtPath({
                treeData: treeData,
                path: rowInfo.path,
                getNodeKey,
                newNode: { ...rowInfo.node, title: name },
              });

              settreeData(localTree);
            }}
          />
        ) : (
          rowInfo.node.title
        )}

        <button onClick={() => setisEditing(!isEditing)}>Edit</button>
      </div>

      <div>
        <button onClick={() => onChangeExpand(rowInfo.node.expanded)}>
          Expanded: {rowInfo.node.expanded ? "true" : "false"}
        </button>
      </div>
    </div>
  );
};

const ChildNode = ({ rowInfo, handleInputChange, selectedItems, matches }) => {
  if (!rowInfo || !rowInfo.node) return <></>;

  return (
    <div
      style={{
        fontWeight: "normal",
      }}
      className={matches.includes(rowInfo.node.title) ? "rowMatch" : ""}
    >
      <input
        name={rowInfo.node.title}
        type="checkbox"
        checked={selectedItems.includes(rowInfo.node.title)}
        onChange={handleInputChange}
      />
      {rowInfo.node.title} {rowInfo.node.brand}
    </div>
  );
};

export default function FunctionalApp() {
  const [newNodeName, setnewNodeName] = useState("");
  const [selectedItems, setselectedItems] = useState<string[]>([]);

  const [searchTerm, setsearchTerm] = useState("");
  const [matches, setmatches] = useState<string[]>([]);

  const [treeData, settreeData] = useState<any>([
    {
      title: "Food",
      type: "artifact",
      expanded: true,
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
            { title: "Soy", type: "asset", brand: "Coles" },
            { title: "Cow", type: "asset", brand: "Canberra milk" },
          ],
        },
        { title: "Water", type: "asset" },
      ],
    },
  ]);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    console.log({ name, value });
    if (value) {
      // Add to list
      const localList = [...selectedItems];
      localList.push(name);
      setselectedItems(localList);
    } else {
      // Remove from list
      const localList = [...selectedItems];
      const index = localList.indexOf(name);
      if (index > -1) {
        localList.splice(index, 1);
      }
      setselectedItems(localList);
    }
  };

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

  const searchHandler = (event) => {
    setsearchTerm(event.target.value);
  };

  const customSearchMethod = ({ node, searchQuery }) =>
    searchQuery &&
    node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

  // useEffect(() => {
  //   const highlights = document.querySelectorAll(".rowMatch");
  //   for (let match of highlights) {
  //     match.parentElement?.parentElement?.parentElement?.classList.add(
  //       "highlightLightblue"
  //     );
  //   }
  // }, [matches]);

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
          <div>
            Selected items:
            {selectedItems.map((item) => item)}
          </div>
          <div>
            Matches:
            {matches.map((item) => item)}
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <p>Search</p>
            <input type="text" value={searchTerm} onChange={searchHandler} />
            <input type="submit" />
          </form>
          <SortableTree
            // onlyExpandSearchedNodes
            searchFinishCallback={(matches) => {
              setmatches(matches.map((e) => e.node.title));
              console.log("Query and apply after");
            }}
            searchMethod={customSearchMethod}
            searchQuery={searchTerm}
            theme={FileExplorerTheme}
            treeData={treeData}
            // canDrag={false}
            onChange={(t) => settreeData(t)}
            canNodeHaveChildren={(node) => node.type === "artifact"}
            generateNodeProps={(rowInfo) => {
              // console.log({ rowInfo });
              return {
                title:
                  rowInfo.node.children && rowInfo.node.children.length ? (
                    <ParentRow
                      settreeData={settreeData}
                      treeData={treeData}
                      rowInfo={rowInfo}
                    />
                  ) : (
                    <ChildNode
                      selectedItems={selectedItems}
                      matches={matches}
                      handleInputChange={handleInputChange}
                      rowInfo={rowInfo}
                    />
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
