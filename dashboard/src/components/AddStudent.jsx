import React, { useState } from "react";
import "./AddStudent.css";

export default function AddStudent({ students, vans }) {
  const [searchStudent, setSearchStudent] = useState("");
  const [searchVan, setSearchVan] = useState("");
  const [message, setMessage] = useState("");

  const handleStudentSelect = (studentId) => {
    setSearchStudent(studentId);
  };

  const handleVanSelect = (vanId) => {
    setSearchVan(vanId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/vans/addStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vanId: searchVan, studentId: searchStudent }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage("Failed to add student to van.");
    }
    if (response.ok) {
      setSearchVan("");
      setSearchStudent("");
      alert("Student added to van!");
    }
  };

  return (
    <div className="add-student-container">
      <h3>Add Student to Van</h3>
      <form className="add-student-form" onSubmit={handleSubmit}>
        <div className="search-bar">
          <label>Search for Student:</label>
          <input
            className="search-bar"
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
          />
          <ul className="search-results">
            {students
              .filter((student) =>
                student.name.toLowerCase().includes(searchStudent.toLowerCase())
              )
              .map((student) => (
                <li
                  key={student._id}
                  onClick={() => handleStudentSelect(student._id)}
                  className="search-student"
                >
                  <div className="search-student-div">
                    <div>{student.name}</div>
                    <div>{student.address}</div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="search-bar">
          <label>Search for Van:</label>
          <input
            className="search-bar"
            type="text"
            value={searchVan}
            onChange={(e) => setSearchVan(e.target.value)}
          />
          <ul className="search-results">
            {vans
              .filter((van) =>
                van.plate.toLowerCase().includes(searchVan.toLowerCase())
              )
              .map((van) => (
                <li key={van._id} onClick={() => handleVanSelect(van._id)}>
                  {van.plate}
                </li>
              ))}
          </ul>
        </div>
        <button className="btn-add" type="submit">
          Add Student to Van
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
