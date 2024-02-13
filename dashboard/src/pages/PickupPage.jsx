import React, { useState } from "react";
import "./PickupPage.scss";

const PickupPage = () => {
  // Define the days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Define sample kid data (you'll replace this with fetched data later)
  const kids = ["Alice", "Bob", "Charlie", "David", "Eve"];

  // Initialize state to manage attendance
  const [attendance, setAttendance] = useState({});

  // Function to handle toggling attendance status
  const toggleAttendance = (kid, day) => {
    const updatedAttendance = { ...attendance };
    const currentStatus = updatedAttendance[kid]?.[day] || "P"; // Default to 'Present' if not set
    const newStatus =
      currentStatus === "P" ? "A" : currentStatus === "A" ? "N" : "P"; // Toggle status
    updatedAttendance[kid] = { ...updatedAttendance[kid], [day]: newStatus };
    setAttendance(updatedAttendance);
  };

  return (
    <div className="pickupContainer">
      <h1>Pickup Schedule</h1>
      <p>Manage the pickup schedule for the kids:</p>
      <table>
        <thead>
          <tr>
            <th></th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kids.map((kid) => (
            <tr key={kid}>
              <td>{kid}</td>
              {daysOfWeek.map((day) => (
                <td key={day} onClick={() => toggleAttendance(kid, day)}>
                  {attendance[kid]?.[day] || "N"}{" "}
                  {/* Default to 'Non-Day' if not set */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PickupPage;
