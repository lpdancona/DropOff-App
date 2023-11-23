// RoutesPage.js

import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listVans, listKids } from "../graphql/queries";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import "./RoutesPage.css";

function RoutesPages() {
  const [vans, setVans] = useState([]);
  //const [allKids, setAllKids] = useState([]);
  const [kidsOnVan, setKidsOnVan] = useState([]);
  const [kidsWithoutVan, setKidsWithoutVan] = useState([]);

  function handleOnDragKidBoxEnd(result) {
    if (!result.destination) return;
    const newOrder = Array.from(kidsWithoutVan);
    const [draggedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, draggedItem);
    setKidsWithoutVan(newOrder);
  }

  function handleOnDragVanBoxEnd(result) {
    if (!result.destination) return;
    const newOrder = Array.from(kidsOnVan);
    const [draggedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, draggedItem);
    setKidsOnVan(newOrder);
  }

  const fetchVansData = async () => {
    try {
      const vansResponse = await API.graphql(
        graphqlOperation(listVans, { limit: 100 })
      );
      const vansData = vansResponse.data.listVans.items;
      setVans(vansData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchKidsWithoutVan = async () => {
    try {
      const variables = {
        filter: { vanID: { attributeExists: false } },
      };
      const kidsWithoutVanResponse = await API.graphql({
        query: listKids,
        variables: variables,
      });
      const kidsWithoutVanData = kidsWithoutVanResponse.data.listKids.items;
      setKidsWithoutVan(kidsWithoutVanData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchKidsInVans = async () => {
    try {
      const vansResponse = await API.graphql(
        graphqlOperation(listVans, { limit: 100 })
      );
      const vansData = vansResponse.data.listVans.items;

      for (const van of vansData) {
        const variables = {
          filter: { vanID: { eq: van.id } },
        };

        const kidsInVan = await API.graphql({
          query: listKids,
          variables: variables,
        });

        const kidsData = kidsInVan.data.listKids.items;
        setKidsOnVan((prevKids) => ({ ...prevKids, [van.id]: kidsData }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchVansAndKids = async () => {
      await fetchVansData();
      await fetchKidsWithoutVan();
      await fetchKidsInVans();
    };

    fetchVansAndKids();
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
                {kidsWithoutVan.map((kid, index) => (
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
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      <div className="vans-list">
        <h2>All Vans</h2>
        <DragDropContext onDragEnd={handleOnDragVanBoxEnd}>
          <Droppable droppableId="vansBox" type="group" direction="vertical">
            {(provided) => (
              <div
                className="vans"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {vans.map((van) => (
                  <div key={van.id} className="van-item">
                    <h3>{van.name}</h3>
                    <div className="kids-in-van">
                      {kidsOnVan[van.id]?.map((kid) => (
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
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default RoutesPages;
