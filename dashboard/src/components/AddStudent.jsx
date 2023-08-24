import React, { useState } from "react";

export default function AddStudent() {
  const [studentId, setStudentId] = useState("");
  const [vanId, setVanId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/vans/addStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vanId, studentId }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
    } else {
      setMessage("Failed to add student to van.");
    }
  };

  return (
    <div>
      <h3>Add Student to Van</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <div>
          <label>Van ID:</label>
          <input
            type="text"
            value={vanId}
            onChange={(e) => setVanId(e.target.value)}
          />
        </div>
        <button type="submit">Add Student to Van</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
