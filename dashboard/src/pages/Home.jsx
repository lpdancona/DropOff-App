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
    axios
      .get("https://drop-off-app-dere.onrender.com/api/weekdays")
      .then((response) => {
        setWeekdays(response.data.weekdays);
      });
  }, []);
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch(
        "https://drop-off-app-dere.onrender.com/api/students"
      );
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
      axios
        .get(
          `https://drop-off-app-dere.onrender.com/api/weekdays/${selectedId}/vans`
        )
        .then((response) => {
          setVans(response.data.vans);
        });
    } else {
      // Clear the vans when no weekday is selected
      setVans([]);
    }
  };

  return (
    <div className="home-main">
      <div className="home-header">
        <h1>Select a Weekday</h1>
        <select onChange={handleWeekdaySelect} value={selectedWeekday}>
          <option value="">Select a Weekday</option>
          {weekdays.map((weekday) => (
            <option key={weekday._id} value={weekday._id}>
              {weekday.weekday}
            </option>
          ))}
        </select>
      </div>

      {selectedWeekday && (
        <div>
          <h2>
            {/* Vans for{" "}
            {weekdays.find((day) => day._id === selectedWeekday)?.weekday} */}
          </h2>
          <ul className="weekday-van-list">
            {vans.map((van) => (
              <li key={van._id} className="weekday-van-item">
                {van.model}
                <ul className="van-students-weekday">
                  {van.students.map((studentId) => {
                    const student = students.find((s) => s._id === studentId);
                    return (
                      <li key={student._id} className="van-student-weekday">
                        <img src={student.photo} alt="" />

                        <div className="weekday-van-student">
                          {student.name}
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
