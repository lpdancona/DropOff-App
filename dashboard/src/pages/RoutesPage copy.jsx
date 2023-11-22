import "./RoutesPage.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserXmark,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { getRoute, listRoutes, listVans, getVan } from "../graphql/queries";

function RoutesPages() {
  const [routesData, setRoutesData] = useState([]);
  const [vans, setVans] = useState([]);
  const [selectedVanName, setSelectedVanName] = useState("");
  const [selectedVan, setSelectedVan] = useState(null);

  useEffect(() => {
    // Fetch the list of vans using the GraphQL query
    const fetchVans = async () => {
      try {
        const response = await API.graphql(
          graphqlOperation(listVans, { limit: 100 })
        );
        const vansData = response.data.listVans.items;
        setVans(vansData);
      } catch (error) {
        console.error("Error fetching vans:", error);
      }
    };
    fetchVans();
  }, []);

  async function getVanById(vanId) {
    try {
      const response = await API.graphql({
        query: getVan,
        variables: { id: vanId },
      });
      const vanData = response.data.getVan;

      return vanData;
    } catch (error) {
      console.error("Error fetching van:", error);
      throw error;
    }
  }

  const handleVanModelSelect = async (e) => {
    const name = e.target.value;
    setSelectedVanName(name);

    // Find the first van with the selected model
    const selectedVanData = vans.find((van) => van && van.name === name);

    if (selectedVanData) {
      const vanDetails = await getVanById(selectedVanData.id);
      setSelectedVan(vanDetails);
    } else {
      setSelectedVan(null);
    }
  };

  return (
    <div className="home">
      <div className="home-container"></div>
      <div className="vans-container">
        <div className="vans">
          <h2>Routes </h2>
          <label>Select vehicle to change/make route: </label>
          <select
            value={selectedVanName}
            onChange={handleVanModelSelect}
            className="model-select"
          >
            <option value="">Select a vehicle</option>
            {vans.map((van) => (
              <option key={van.id} value={van.name}>
                {van && van.name ? van.name : "Unknown Model"} - {van.model}
              </option>
            ))}
          </select>

          {selectedVan && (
            <div className="selected-van-info">
              <div className="share-van">
                <h3>
                  Selected Van: {selectedVan.name} - {selectedVan.model}
                </h3>{" "}
                <Link
                  to={`/routes/${selectedVan.id}`}
                  className="view-details-button"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default RoutesPages;
