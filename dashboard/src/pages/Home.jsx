import React, { useEffect, useState } from "react";
import "./Home.css";
import StudentDetails from "../components/StudentDetails";
import StudentForm from "../components/StudentForm";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [vans, setVans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ageFilter, setAgeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const studentsPerPage = 4;

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("/api/students");
      const json = await response.json();

      if (response.ok) {
        setStudents(json.students);
      }
    };
    fetchStudents();
  }, []);
  useEffect(() => {
    const fetchVans = async () => {
      const response = await fetch("/api/vans");
      const json = await response.json();

      if (response.ok) {
        setVans(json.vans);
      }
    };
    fetchVans();
  });

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;

  // Apply filters
  const filteredStudents = students.filter((student) => {
    return (
      (ageFilter === "" || student.age === parseInt(ageFilter)) &&
      (nameFilter === "" ||
        student.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (addressFilter === "" ||
        student.address.toLowerCase().includes(addressFilter.toLowerCase()))
    );
  });

  const displayedStudents = filteredStudents.slice(startIndex, endIndex);

  return (
    <div className="home">
      <div className="home-container">
        <div className="students-container">
          <h3>Students</h3>
          <div className="filters">
            <input
              type="text"
              placeholder="Filter by Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Age"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Address"
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
            />
          </div>
          <div className="student">
            {displayedStudents.map((student) => (
              <StudentDetails key={student._id} student={student} />
            ))}
          </div>
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={endIndex >= filteredStudents.length}
              className="btn"
            >
              Next
            </button>
          </div>
        </div>
        <div className="left-container">
          <StudentForm />
        </div>
      </div>
      <div className="vans-container">
        <h3>Vans</h3>
        <div className="van-container">
          {vans.map((van) => (
            <div className="van">
              {van.plate}
              {van.model}
              {van.year}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
