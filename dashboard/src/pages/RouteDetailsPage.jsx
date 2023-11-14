import React, { useEffect, useState } from "react";
import "./RouteDetailsPage.css";
import { useParams, Link } from "react-router-dom";
import { API } from "aws-amplify";
import { listKids } from "../graphql/queries";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const RouteDetailsPage = () => {
  const params = useParams();
  const [kidsOnVan, setKidsOnVan] = useState([]);

  function handleOnDragEnd(result) {
    //console.log("drag drops event");
    if (!result.destination) return;
    const newOrder = Array.from(kidsOnVan);
    const [draggedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, draggedItem);
    setKidsOnVan(newOrder);
  }

  useEffect(() => {
    const fetchKidsOnVan = async () => {
      const vanId = params.vanId;
      try {
        const variables = {
          filter: { vanID: { eq: vanId } },
        };
        const response = await API.graphql({
          query: listKids,
          variables: variables,
        });
        const kidsData = response.data.listKids.items;
        setKidsOnVan(kidsData);
      } catch (error) {
        console.error("Error fetching Kids", error);
      }
    };
    fetchKidsOnVan();
  }, []);

  return (
    <div>
      <h2>Route Details</h2>

      <h3>Kids on the Route</h3>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="boxes" type="group" direction="vertical">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="boxes-container"
            >
              {kidsOnVan.map((kid, index) => (
                <Draggable
                  key={kid.id}
                  draggableId={kid.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="box-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="box-button">
                        <div className="box-number">{index + 1}</div>
                        <div className="box-name">{kid.name} - </div>
                        <div className="box-address">{kid.dropOffAddress}</div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <h3>Route Map</h3>

      <Link to="/routes">Back to Vans</Link>
    </div>
  );
};

export default RouteDetailsPage;
