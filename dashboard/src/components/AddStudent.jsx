import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddStudent.css";

const AddStudentToVan = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    vanId: "",
  });

  const [students, setStudents] = useState([]);
  const [vans, setVans] = useState([]);
  const [selectedVanStudents, setSelectedVanStudents] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    // Fetch the list of students and vans from your API
    const fetchStudentsAndVans = async () => {
      try {
        const studentsResponse = await axios.get("/api/students");
        const vansResponse = await axios.get("/api/vans");

        setStudents(studentsResponse.data.students);
        setVans(vansResponse.data.vans);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    fetchStudentsAndVans();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "vanId") {
      const selectedVan = vans.find((van) => van._id === e.target.value);
      setSelectedVanStudents(selectedVan ? selectedVan.students : []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/vans/addStudent", formData);
      setSuccessMessage("Student has been successfully added!");
      window.location.reload();
      console.log(response.data); // Handle success
      alert("Student has been added to van");
    } catch (error) {
      console.error(error.response.data); // Handle errors
    }
  };

  // Filter students by name
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  return (
    <div className="add-student-container">
      <h2>Add Student to Van</h2>
      <div className="filter-inputs">
        <input
          type="text"
          placeholder="Filter by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <select
          className="sel"
          name="studentId"
          onChange={handleChange}
          required
        >
          <option value="">Select a Student</option>
          {filteredStudents.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name}
            </option>
          ))}
        </select>
        <select className="sel" name="vanId" onChange={handleChange} required>
          <option value="">Select a Van</option>
          {vans.map((van) => (
            <option key={van._id} value={van._id}>
              {van.model} - {van.plate}
            </option>
          ))}
        </select>
        <button className="sel-btn sel" type="submit">
          Assign Student to Van
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default AddStudentToVan;
