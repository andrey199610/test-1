import React, { useEffect, useState } from "react";
import { firestore } from "./firebase/config";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./App.css";
import Tasks from "./components/tasks";

function App() {
  const [columns, setColumns] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });

      fetchupdate(sourceItems, sourceColumn.id);
      fetchupdate(destItems, destColumn.id);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });

      fetchupdate(copiedItems, column.id);
    }
  };

  const fetchTasks = async () => {
    const req = await firestore.collection("groupstest").get();
    const tempTasks = req.docs.map((task) => ({
      ...task.data(),
      id: task.id,
    }));
    setColumns(tempTasks);
  };

  const fetchupdate = async (arr, id) => {
    await firestore.collection("groupstest").doc(id).update({
      items: arr,
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="wrapper">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div className="column" key={columnId}>
              <h2>{column.name}</h2>
              <div className="wrapper_droppable">
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="column_tasks"
                      style={{
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "lightgrey",
                      }}
                    >
                      {column.items.map((item, index) => (
                        <Tasks item={item} key={item.id} index={index}></Tasks>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
