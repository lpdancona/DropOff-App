// RoutesPage.js

import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listVans, getVan, listKids } from "../graphql/queries";

import "./RoutesPage.css";

function RoutesPages() {
  const [vans, setVans] = useState([]);
  const [allKids, setAllKids] = useState([]);

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
      <div className="kids-list">
        <h2>Kids to Drop-off</h2>
        <div className="kids">
          {allKids
            .filter((kid) => !kid.vanID)
            .map((kid) => (
              <div key={kid.id} className="kid-item">
                <div className="kid-name">{kid.name}</div>
                <div className="drop-off-address">{kid.dropOffAddress}</div>
              </div>
            ))}
        </div>
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
    </div>
  );
}

export default RoutesPages;
