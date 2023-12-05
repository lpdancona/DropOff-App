import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listVans, listKids } from "../graphql/queries";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import "./RoutesPage.css";

const RoutesPages = () => {
  const [vans, setVans] = useState([]);
  const [kidsOnVan, setKidsOnVan] = useState({});
  const [kidsWithoutVan, setKidsWithoutVan] = useState([]);

  // const handleOnDragKidBoxEnd = (result) => {
  //   console.log("result of handle DragKidBoxEnd", result);
  //   if (!result.destination) return;

  //   const sourceVanId = result.source.droppableId.replace("van-", "");
  //   const destinationVanId = result.destination.droppableId.replace("van-", "");
  //   console.log(sourceVanId);
  //   console.log(destinationVanId);

  //   if (sourceVanId === "withoutVan" || destinationVanId === "withoutVan") {
  //     const kidId = kidsWithoutVan[result.source.index].id;
  //     moveKidBetweenVansAndWithoutVan(kidId, sourceVanId, destinationVanId);
  //   } else {
  //     // Handle moving kids within the same van
  //     const newOrder = Array.from(kidsWithoutVan[sourceVanId]);
  //     const [draggedItem] = newOrder.splice(result.source.index, 1);
  //     newOrder.splice(result.destination.index, 0, draggedItem);
  //     setKidsWithoutVan((prevKids) => ({
  //       ...prevKids,
  //       [sourceVanId]: newOrder,
  //     }));
  //   }
  // };

  // const handleOnDragKids = (result) => {
  //   console.log("result of handle DragKidBoxEnd", result);
  //   if (!result.destination) return;

  //   const newOrder = Array.from(kidsWithoutVan);
  //   const [draggedItem] = newOrder.splice(result.source.index, 1);
  //   newOrder.splice(result.destination.index, 0, draggedItem);
  //   setKidsWithoutVan(newOrder);
  // };

  const handleOnDragEnd = (result) => {
    const moveKidsToVans = (kidId, source, destinationVanId) => {
      setKidsWithoutVan((prevKidsWithoutVan) => {
        // Find the index of the kid in the source van
        const kidIndex = prevKidsWithoutVan.findIndex(
          (kid) => kid.id === kidId
        );
        console.log(kidIndex);
        if (kidIndex === -1) {
          // Kid not found in the source van
          return prevKidsWithoutVan;
        }

        // Remove the kid from the source van
        const movedKid = prevKidsWithoutVan[kidIndex];
        const newSourceOrder = [...prevKidsWithoutVan];
        newSourceOrder.splice(kidIndex, 1);

        setKidsOnVan((prevKidsOnVan) => {
          // Check if the kid is moved to a different van
          if (source !== destinationVanId) {
            // Add the kid to the destination van
            const newDestinationOrder = {
              ...prevKidsOnVan,
              [destinationVanId]: [
                ...(prevKidsOnVan[destinationVanId] || []),
                movedKid,
              ],
            };

            // Remove the kid from the source van in kidsOnVan if it exists
            if (source in newDestinationOrder) {
              const updatedSourceVan = [...newDestinationOrder[source]];
              const kidIndexInSourceVan = updatedSourceVan.findIndex(
                (kid) => kid.id === kidId
              );

              if (kidIndexInSourceVan !== -1) {
                updatedSourceVan.splice(kidIndexInSourceVan, 1);
                newDestinationOrder[source] = updatedSourceVan;
              }
            }

            return newDestinationOrder;
          }

          // Update the state with the new order for the same van
          return {
            ...prevKidsOnVan,
            [source]: [...(prevKidsOnVan[source] || []), movedKid],
          };
        });

        // Update the state with the new order for kidsWithoutVan
        return newSourceOrder;
      });
    };

    const moveKidsBetweenVans = (kidId, sourceVanId, destinationVanId) => {
      setKidsOnVan((prevKids) => {
        // Check if the kid is moved to a different van
        if (sourceVanId !== destinationVanId) {
          const newSourceOrder = Array.from(prevKids[sourceVanId] || []);
          const [movedKid] = newSourceOrder.splice(result.source.index, 1);

          return {
            ...prevKids,
            [sourceVanId]: newSourceOrder,
            [destinationVanId]: [
              ...(prevKids[destinationVanId] || []),
              movedKid,
            ],
          };
        }

        const newOrder = Array.from(prevKids[sourceVanId]);
        const [draggedItem] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, draggedItem);

        // Update the state with the new order
        return {
          ...prevKids,
          [sourceVanId]: newOrder,
        };
      });
    };

    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;

    if (sourceId === destinationId) {
      // Move within the same list (Kids to Drop-off or within the same van)
      if (sourceId === "kidsBox") {
        const newOrder = Array.from(kidsWithoutVan);
        const [draggedItem] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, draggedItem);

        setKidsWithoutVan(newOrder);
      } else {
        // Move within the same van
        const vanId = sourceId.replace("van-", ""); // Extract van ID from droppableId
        const vanKids = kidsOnVan[vanId] || []; // Ensure vanKids is defined
        const newOrder = Array.from(vanKids);
        const [draggedItem] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, draggedItem);

        setKidsOnVan((prevKids) => ({
          ...prevKids,
          [vanId]: newOrder,
        }));
      }
    } else {
      if (sourceId === "kidsBox" && destinationId !== "kidsBox") {
        console.log("kidsWithoutVan", kidsWithoutVan);
        console.log("kidsOnVan", kidsOnVan);
        const sourceKidsWithoutVan = result.source.droppableId;
        const destinationVanId = result.destination.droppableId;
        const kidId = kidsWithoutVan[result.source.index].id;
        moveKidsToVans(kidId, sourceKidsWithoutVan, destinationVanId);
        console.log("kidsWithoutVan", kidsWithoutVan);
        console.log("kidsOnVan", kidsOnVan);
      } else {
        const sourceVanId = result.source.droppableId.replace("van-", "");
        const destinationVanId = result.destination.droppableId.replace(
          "van-",
          ""
        );
        const kidId = kidsOnVan[sourceVanId][result.source.index].id;
        moveKidsBetweenVans(kidId, sourceVanId, destinationVanId);
      }
      // Move between lists (Kids to Drop-off to a van)
    }
  };

  const fetchVansData = async () => {
    try {
      const vansResponse = await API.graphql(
        graphqlOperation(listVans, { limit: 100 })
      );
      const vansData = vansResponse.data.listVans.items;
      setVans(vansData);
    } catch (error) {
      console.error("Error fetching vans data:", error);
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
      console.error("Error fetching kids without van data:", error);
    }
  };

  const fetchKidsInVans = async () => {
    try {
      const vansResponse = await API.graphql(graphqlOperation(listVans));
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
      console.error("Error fetching kids in vans data:", error);
    }
  };

  useEffect(() => {
    const fetchVansAndKids = async () => {
      await fetchVansData();
      await fetchKidsWithoutVan();
      await fetchKidsInVans();
    };
    console.log("main fetch");
    fetchVansAndKids();
  }, []);

  return (
    <div className="routes-container">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="kids-list">
          <h2>Kids to Drop-off</h2>
          <Droppable droppableId="kidsBox" type="kid" direction="vertical">
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
        {/* </DragDropContext> */}

        <div className="vans-list">
          <h2>All Vans</h2>
          {/* <DragDropContext onDragEnd={handleOnDragVanBoxEnd}> */}
          <Droppable droppableId="vansBox" type="group" direction="vertical">
            {(provided) => (
              <div
                className="vans"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {vans.map((van) => (
                  <Droppable
                    key={van.id}
                    droppableId={`van-${van.id}`}
                    type="kid"
                  >
                    {(provided) => (
                      <div
                        className="van-item"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <h3>{van.name}</h3>
                        <div className="kids-in-van">
                          {kidsOnVan[van.id]?.map((kid, index) => (
                            <Draggable
                              key={kid.id}
                              draggableId={(kid.id || index).toString()}
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
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default RoutesPages;
