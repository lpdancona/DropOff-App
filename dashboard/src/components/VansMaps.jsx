import { useMemo, useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import "./VansMaps.css";
import gbIcon from "../docs/gb-logo.svg";
import houseIcon from "../docs/icon-house.png";
import { listAddressLists } from "../graphql/queries";
export default function VansMaps() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_APIKEY,
  });
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 49.26329, lng: -123.10081 }), []);
  const markerOptions = {
    icon: {
      url: gbIcon,
      scaledSize: new window.google.maps.Size(50, 50),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 40),
    },
  };
  const houseMarker = {
    icon: {
      url: houseIcon,
      scaledSize: new window.google.maps.Size(30, 30),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 40),
    },
  };
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [studentAddresses, setStudentAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const toggleInfoWindow = () => {
    setInfoWindowOpen(!infoWindowOpen);
  };

  useEffect(() => {
    const fetchAdresses = async () => {
      try {
        const response = await API.graphql(
          graphqlOperation(listAddressLists, { limit: 100 })
        );
        const adressesData = response.data.listAddressLists.items;
        console.log("fetched data", adressesData);
        setStudentAddresses(adressesData);
      } catch (error) {
        console.error("Error fetching vans:", error);
      }
    };
    fetchAdresses();
  }, []);
  return (
    <GoogleMap zoom={12} center={center} mapContainerClassName="map-container">
      <MarkerF
        position={center}
        options={markerOptions}
        onClick={toggleInfoWindow}
      />
      {Array.isArray(studentAddresses) &&
        studentAddresses.map((address) => (
          <MarkerF
            key={address.id}
            position={{ lat: address.latitude, lng: address.longitude }}
            options={houseMarker}
            onClick={() => {
              setSelectedAddress(address);
              toggleInfoWindow();
            }}
          />
        ))}

      {infoWindowOpen && selectedAddress && (
        <InfoWindowF
          position={{
            lat: selectedAddress.latitude,
            lng: selectedAddress.longitude,
          }}
          onCloseClick={toggleInfoWindow}
        >
          <div>
            <h3>Address Details</h3>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
