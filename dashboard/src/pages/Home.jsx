import React, { useEffect, useState } from "react";
import "./Home.css";
import AddStudent from "../components/AddStudent";
export default function Home() {
  const [students, setStudents] = useState([]);
  const [vans, setVans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ageFilter, setAgeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [selectedWeekday, setSelectedWeekday] = useState(null);
  const [weekdays, setWeekdays] = useState([]);
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
  useEffect(() => {
    const fetchWeekdays = async () => {
      const response = await fetch("/api/weekdays");
      const json = await response.json();

      if (response.ok) {
        setWeekdays(json.weekdays);
      }
    };
    fetchWeekdays();
  }, []);

  const handleWeekdaySelect = (event) => {
    const selectedWeekdayId = event.target.value;
    setSelectedWeekday(selectedWeekdayId);
  };

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
  const handleStudentAdded = async () => {
    try {
      const response = await fetch("/api/students");
      const json = await response.json();

      if (response.ok) {
        setStudents(json.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <div className="home-main">
      <div className="home">
        <div className="home-container"></div>
        <div className="vans-container">
          <h3>Vans</h3>
          <div className="van-container">
            {vans.map((van) => (
              <div className="van" key={van._id}>
                {van.plate}
                {van.model}
                {van.year}
              </div>
            ))}
          </div>
          <AddStudent students={students} vans={vans} />
        </div>
      </div>
      <h3>Weekday Vans</h3>
      <div className="weekday-selector">
        <select onChange={handleWeekdaySelect}>
          <option value="">Select a Weekday</option>
          {weekdays.map((weekday) => (
            <option key={weekday._id} value={weekday._id}>
              {weekday.weekday}
            </option>
          ))}
        </select>
      </div>
      {/* Display vans associated with the selected weekday */}
      {selectedWeekday && (
        <div className="vans-for-weekday">
          <h4>Vans for {selectedWeekday.weekday}</h4>
          <ul>
            {selectedWeekday.vans.map((van) => (
              <li key={van._id}>
                {van.plate} {van.model} {van.year}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
