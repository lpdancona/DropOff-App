// RoutesPage.js

import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listVans, getVan, listKids } from "../graphql/queries";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import "./RoutesPage.css";

function RoutesPages() {
  const [vans, setVans] = useState([]);
  const [allKids, setAllKids] = useState([]);
  const [kidsOnVan, setKidsOnVan] = useState([]);

  function handleOnDragKidBoxEnd(result) {
    // console.log("drag drops event", result);
    // console.log("destination", result.destination);

    if (!result.destination) return;
    const newOrder = Array.from(allKids);
    const [draggedItem] = newOrder.splice(result.source.index, 1);
    console.log(draggedItem);
    newOrder.splice(result.destination.index, 0, draggedItem);
    setAllKids(newOrder);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vansResponse = await API.graphql(
          graphqlOperation(listVans, { limit: 100 })
        );
        const vansData = vansResponse.data.listVans.items;
        setVans(vansData);

        const kidsResponse = await API.graphql({
          query: listKids,
          variables: {
            filter: { vanID: { ne: null } },
          },
        });
        const kidsData = kidsResponse.data.listKids.items;
        setAllKids(kidsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="routes-container">
      <DragDropContext onDragEnd={handleOnDragKidBoxEnd}>
        <div className="kids-list">
          <h2>Kids to Drop-off</h2>
          <Droppable droppableId="kidsBox" type="group" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kids"
              >
                {allKids
                  .filter((kid) => !kid.vanID)
                  .map((kid, index) => (
                    <Draggable
                      key={kid.id}
                      draggableId={kid.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          key={kid.id}
                          className="kid-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="kid-name">{kid.name}</div>
                          <div className="drop-off-address">
                            {kid.dropOffAddress}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
              </div>
            )}
          </Droppable>
        </div>

        <div className="vans-list">
          <h2>All Vans</h2>
          <div className="vans">
            {vans.map((van) => (
              <div key={van.id} className="van-item">
                <h3>{van.name}</h3>
                <div className="kids-in-van">
                  {allKids
                    .filter((kid) => kid.vanID === van.id)
                    .map((kid) => (
                      <div key={kid.id} className="kid-item">
                        <div className="kid-name">{kid.name}</div>
                        <div className="drop-off-address">
                          {kid.dropOffAddress}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default RoutesPages;
