import React, { useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Kid } from "../models";
import "./StudentForm.css";
import GoogleMapsAutocomplete from "./GoogleMapsAutocomplete";
function StudentForm({ onStudentAdded }) {
  const [name, setName] = useState("");
  const [parent1Email, setParent1Email] = useState("");
  const [parent2Email, setParent2Email] = useState("");
  const [dropOffAddress, setDropOffAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new Kid object
      const newKid = await DataStore.save(
        new Kid({
          name: name,
          parent1Email: parent1Email,
          parent2Email: parent2Email,
          dropOffAddress: dropOffAddress,
          lat: lat,
          lng: lng,
          birthDate: birthDate,
          photo: photo,
        })
      );
      // Reset form fields and clear errors on success
      setName("");
      setParent1Email("");
      setParent2Email("");
      setDropOffAddress("");
      setLat(null);
      setLng(null);
      setBirthDate("");
      setPhoto("");
      // Clear the photo state
      setError(null);
      console.log("New Kid added", newKid);
      alert("New Kid added!");
      onStudentAdded();
    } catch (error) {
      console.error("Error adding Kid", error);
      setError("Failed to add Kid.");
      alert("Failed to add Kid.");
    }
  };
  const handleAddressSelect = (selectedPlace) => {
    setDropOffAddress(selectedPlace.formatted_address);
    setLat(selectedPlace.geometry.location.lat());
    setLng(selectedPlace.geometry.location.lng());
  };
  const handlePhotoChange = (e) => {
    // Handle photo upload or selection here and update the 'photo' state // For example, you can use FileReader to read the selected file and set it in the state.
    const selectedPhoto = e.target.files[0];
    setPhoto(selectedPhoto);
  };
  return (
    <form className="create" onSubmit={handleSubmit}>
      {" "}
      <h3>Add a New Kid</h3>{" "}
      <div className="form-container">
        {" "}
        <div className="form-item">
          {" "}
          <label>Kid's Name:</label>{" "}
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />{" "}
        </div>{" "}
        <div className="form-item">
          {" "}
          <label>Parent 1 Email:</label>{" "}
          <input
            type="email"
            onChange={(e) => setParent1Email(e.target.value)}
            value={parent1Email}
          />{" "}
        </div>{" "}
        <div className="form-item">
          {" "}
          <label>Parent 2 Email:</label>{" "}
          <input
            type="email"
            onChange={(e) => setParent2Email(e.target.value)}
            value={parent2Email}
          />{" "}
        </div>{" "}
        <div className="form-item">
          {" "}
          <label>Drop-Off Address:</label>{" "}
          <GoogleMapsAutocomplete onPlaceSelect={handleAddressSelect} />{" "}
        </div>{" "}
        <div className="form-item">
          {" "}
          <label>Birth Date:</label>{" "}
          <input
            type="date"
            onChange={(e) => setBirthDate(e.target.value)}
            value={birthDate}
          />{" "}
        </div>{" "}
        <div className="form-item">
          {" "}
          <label>Photo:</label>{" "}
          <input type="text" onChange={(e) => setPhoto(e.target.value)} />{" "}
        </div>{" "}
        <button className="create-btn">Add Kid</button>{" "}
        {error && <div className="error">{error}</div>}{" "}
      </div>{" "}
    </form>
  );
}
export default StudentForm;
