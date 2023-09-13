import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import Navbar from "../components/Navbar";

export default function Home() {
  const [weekdays, setWeekdays] = useState([]);
  const [selectedWeekday, setSelectedWeekday] = useState("");
  const [vans, setVans] = useState([]);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    axios.get("/api/weekdays").then((response) => {
      setWeekdays(response.data.weekdays);
    });
  }, []);
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

  const handleWeekdaySelect = (event) => {
    const selectedId = event.target.value;
    setSelectedWeekday(selectedId);

    // Fetch the vans for the selected weekday
    if (selectedId) {
      axios.get(`/api/weekdays/${selectedId}/vans`).then((response) => {
        setVans(response.data.vans);
      });
    } else {
      // Clear the vans when no weekday is selected
      setVans([]);
    }
  };

  return (
    <div className="home-main">
      <h1>Select a Weekday</h1>
      <select onChange={handleWeekdaySelect} value={selectedWeekday}>
        <option value="">Select a Weekday</option>
        {weekdays.map((weekday) => (
          <option key={weekday._id} value={weekday._id}>
            {weekday.weekday}
          </option>
        ))}
      </select>

      {selectedWeekday && (
        <div>
          <h2>
            Vans for{" "}
            {weekdays.find((day) => day._id === selectedWeekday)?.weekday}
          </h2>
          <ul>
            {vans.map((van) => (
              <li key={van._id}>
                {van.model}
                <h4>Students</h4>
                <ul className="van-students">
                  {van.students.map((studentId) => {
                    const student = students.find((s) => s._id === studentId);
                    return (
                      <li key={student._id} className="van-student">
                        <img src={student.photo} alt="" />

                        <div className="van-student-info">
                          <div className="van-student-name">{student.name}</div>
                          <div className="van-student-address">
                            {student.address}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
