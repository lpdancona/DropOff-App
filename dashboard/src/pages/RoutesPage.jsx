import React, { useCallback, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listVans, listKids } from "../graphql/queries";
import { updateKid } from "../graphql/mutations";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

import "./RoutesPage.css";

const RoutesPages = () => {
  const [vans, setVans] = useState([]);
  const [kidsOnVan, setKidsOnVan] = useState({});
  const [kidsWithoutVan, setKidsWithoutVan] = useState([]);
  const [selectedVan, setSelectedVan] = useState(null);
  const apikey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const [directions, setDirections] = useState(null);
  const dropOffStartPoint = { lat: 49.26344, lng: -123.10078 };
  const [totalTime, setTotalTime] = useState(null);
  const [totalDistance, setTotalDistance] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [timeToFinish, setTimeToFinish] = useState(null);

  const calculateTimeToFinish = () => {
    if (departureTime && totalTime) {
      const currentTime = new Date();
      const departureDate = new Date(departureTime);

      // Extract hours, minutes, and seconds from the departureTime
      const departureHours = departureDate.getHours();
      const departureMinutes = departureDate.getMinutes();
      const departureSeconds = departureDate.getSeconds();

      // Calculate total departure time in seconds
      const totalDepartureTimeInSeconds =
        departureHours * 3600 + departureMinutes * 60 + departureSeconds;

      // Calculate time to finish
      const timeToFinishInSeconds =
        totalTime + (totalDepartureTimeInSeconds - currentTime.getSeconds());

      setTimeToFinish(Math.max(0, timeToFinishInSeconds));
    }
  };

  useEffect(() => {
    calculateTimeToFinish();
  }, [totalTime, departureTime]);

  const formatTime = (time) => {
    if (typeof time === "string") {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));

      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    // Handle other cases or return an appropriate value
    return time;
  };

  const formatDistance = (meters) => {
    const kilometers = meters / 1000;
    return `${kilometers} km`;
  };

  const containerStyle = {
    width: "800px",
    height: "600px",
  };

  //center on vancouver area
  const center = {
    lat: 49.26337,
    lng: -123.10069,
  };

  const zoomMap = 12;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apikey,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const getDirections = async (waypoints) => {
    try {
      const directionService = new window.google.maps.DirectionsService();

      const lastWaypoint = waypoints[waypoints.length - 1];

      const routeRequest = {
        origin: new window.google.maps.LatLng(
          dropOffStartPoint.lat,
          dropOffStartPoint.lng
        ),
        destination: new window.google.maps.LatLng(
          lastWaypoint.lat,
          lastWaypoint.lng
        ),
        waypoints: waypoints.slice(0, -1).map((kid) => ({
          location: new window.google.maps.LatLng(kid.lat, kid.lng),
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionService.route(routeRequest, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setTotalTime(
            result.routes[0].legs.reduce(
              (acc, leg) => acc + leg.duration.value,
              0
            )
          );
          setTotalDistance(
            result.routes[0].legs.reduce(
              (acc, leg) => acc + leg.distance.value,
              0
            )
          );

          setDirections({
            ...result,
            options: {
              suppressMarkers: true, // To suppress default markers
              markerOptions: {
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8, // Adjust the scale as needed
                  fillColor: "#4285F4", // Marker color
                  fillOpacity: 1,
                  strokeWeight: 0,
                },
              },
            },
          });
        } else {
          console.error("Error fetching directions:", status);
        }
      });
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  useEffect(() => {
    const fetchVanData = async () => {
      try {
        // Fetch data for the selected van
        if (selectedVan && kidsOnVan[selectedVan]) {
          const waypoints = kidsOnVan[selectedVan];
          // Reset directions to null when a new van is selected
          setDirections(null);
          // Fetch directions for the selected van
          getDirections(waypoints);
        }
      } catch (error) {
        console.error("Error fetching van data:", error);
      }
    };

    // Call the fetchVanData function when the selectedVan changes
    fetchVanData();
  }, [selectedVan, kidsOnVan]);

  const updateKidAssociation = async (kidId, vanId) => {
    vanId = vanId.replace("van-", "");
    try {
      // Construct the mutation input
      const mutationInput = {
        id: kidId,
        vanID: vanId,
      };

      await API.graphql(graphqlOperation(updateKid, { input: mutationInput }));
    } catch (error) {
      console.error("Error updating kid association:", error);
    }
  };

  const handleOnDragEnd = (result) => {
    //
    //move the kids from Vans to back to Kids to Drop-Off
    const moveKidsBackToNoVan = (kidId, sourceVanId, destinationVanId) => {
      setKidsOnVan((prevKidsOnVan) => {
        const kidIndexInSourceVan = (
          prevKidsOnVan[sourceVanId] || []
        ).findIndex((kid) => kid.id === kidId);

        if (kidIndexInSourceVan === -1) {
          // Kid not found in the source van
          return prevKidsOnVan;
        }

        // Remove the kid from the source van
        const movedKid = prevKidsOnVan[sourceVanId][kidIndexInSourceVan];
        const updatedSourceVan = [...prevKidsOnVan[sourceVanId]];
        updatedSourceVan.splice(kidIndexInSourceVan, 1);

        // Update the state with the new order for the source van
        const newKidsOnVan = {
          ...prevKidsOnVan,
          [sourceVanId]: updatedSourceVan,
        };

        // Update the state for kidsWithoutVan by adding the moved kid
        setKidsWithoutVan((prevKidsWithoutVan) => {
          const newKidsWithoutVan = [...prevKidsWithoutVan];
          newKidsWithoutVan.splice(result.destination.index, 0, movedKid);
          return newKidsWithoutVan;
        });

        return newKidsOnVan;
      });
    };

    //move the kids from Kids to Drop-off to Vans
    const moveKidsToVans = (kidId, source, destinationVanId) => {
      setKidsWithoutVan((prevKidsWithoutVan) => {
        // Find the index of the kid in the source van
        const kidIndex = prevKidsWithoutVan.findIndex(
          (kid) => kid.id === kidId
        );
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
                //movedKid,
              ],
            };
            newDestinationOrder[destinationVanId].splice(
              result.destination.index,
              0,
              movedKid
            );

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

    //move the kids from one Van to another (BUS 1 TO BUS 4)
    const moveKidsBetweenVans = (kidId, sourceVanId, destinationVanId) => {
      setKidsOnVan((prevKids) => {
        // Check if the kid is moved to a different van
        if (sourceVanId !== destinationVanId) {
          const newSourceOrder = Array.from(prevKids[sourceVanId] || []);
          const [movedKid] = newSourceOrder.splice(result.source.index, 1);

          const newDestinationOrder = {
            ...prevKids,
            [sourceVanId]: newSourceOrder,
            [destinationVanId]: [
              ...(prevKids[destinationVanId] || []),
              //movedKid,
            ],
          };
          newDestinationOrder[destinationVanId].splice(
            result.destination.index,
            0,
            movedKid
          );
          return newDestinationOrder;
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
        const sourceKidsWithoutVan = sourceId; //result.source.droppableId;
        const destinationVanId = result.destination.droppableId.replace(
          "van-",
          ""
        );
        const kidId = kidsWithoutVan[result.source.index].id;
        moveKidsToVans(kidId, sourceKidsWithoutVan, destinationVanId);
        updateKidAssociation(kidId, destinationId);
      } else if (destinationId !== "kidsBox") {
        const sourceVanId = result.source.droppableId.replace("van-", "");
        const destinationVanId = result.destination.droppableId.replace(
          "van-",
          ""
        );
        const kidId = kidsOnVan[sourceVanId][result.source.index].id;
        moveKidsBetweenVans(kidId, sourceVanId, destinationVanId);
        updateKidAssociation(kidId, destinationId);
      } else if (destinationId === "kidsBox") {
        const sourceVanId = result.source.droppableId.replace("van-", "");
        const destinationVanId = result.destination.droppableId.replace(
          "van-",
          ""
        );
        const kidId = kidsOnVan[sourceVanId][result.source.index].id;
        moveKidsBackToNoVan(kidId, sourceVanId, destinationVanId);
        updateKidAssociation(kidId, destinationId);
      }
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
    <div className="main-container">
      <div className="left-container">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="kids-list">
            <h2>Kids to Drop-off</h2>
            <div className="compact-scroll">
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
                            <div className="kid-name">{`${index + 1}. ${
                              kid.name
                            }`}</div>
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
          </div>
          <div className="vans-list">
            <h2>All Vans</h2>
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
                                    <div className="kid-name">{`${index + 1}. ${
                                      kid.name
                                    }`}</div>
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

      <div className="map-container">
        <div className="departure-time">
          <label>Departure Time:</label>
          <input
            type="time"
            value={departureTime || ""}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>
        <div className="van-dropdown">
          <select
            value={selectedVan}
            onChange={(e) => setSelectedVan(e.target.value)}
          >
            <option value={null}>Select Van</option>
            {vans.map((van) => (
              <option key={van.id} value={van.id}>
                {van.name}
              </option>
            ))}
          </select>
        </div>

        {selectedVan && isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoomMap}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {directions && <DirectionsRenderer directions={directions} />}

            {directions && (
              <div className="directions-info">
                <p>Total Time: {formatTime(totalTime)}</p>
                <p>Total Distance: {formatDistance(totalDistance)}</p>
                {timeToFinish !== null && (
                  <div className="time-info">
                    <p>Time to Depart: {formatTime(departureTime)}</p>
                    <p>Time to Finish: {formatTime(timeToFinish)}</p>
                  </div>
                )}
              </div>
            )}

            {/* {kidsOnVan[selectedVan]?.map((kid, index) => (
              <Marker
                key={kid.id}
                position={{
                  lat: kid.lat,
                  lng: kid.lng,
                }}
                label={(index + 1).toString()}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8, // Adjust the scale as needed
                  fillColor: "#4285F4", // Marker color
                  fillOpacity: 1,
                  strokeWeight: 0,
                }}
              />
            ))} */}
            {/* {kidsOnVan[selectedVan]?.map((kid, index) => (
              <Marker
                key={kid.id}
                position={{
                  lat: kid.lat,
                  lng: kid.lng,
                }}
                label={(index + 1).toString()}
              />
            ))} */}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default RoutesPages;
