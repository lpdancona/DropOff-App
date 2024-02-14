import React, { useState } from "react";
import { Card, Button } from "antd";
import "./PickupPage.scss";

const PickupPage = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const kids = ["Emma", "Bob", "Charlie", "David", "Eve"];
  const [attendance, setAttendance] = useState({});

  const toggleAttendance = (kid, day) => {
    const updatedAttendance = { ...attendance };
    const currentStatus = updatedAttendance[kid]?.[day] || "P";
    const newStatus =
      currentStatus === "P" ? "A" : currentStatus === "A" ? "N" : "P"; // Toggle status
    updatedAttendance[kid] = { ...updatedAttendance[kid], [day]: newStatus };
    setAttendance(updatedAttendance);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "A":
        return { backgroundColor: "red", color: "white" }; // Red color for 'A'
      case "P":
        return { backgroundColor: "green", color: "white" }; // Green color for 'P'
      case "N":
        return { backgroundColor: "blue", color: "white" }; // Blue color for 'N'
      default:
        return { backgroundColor: "blue", color: "white" }; // Default to blue if status is not recognized
    }
  };

  return (
    <div className="pickupContainer">
      <Card className="scheduleCard">
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
                  <td key={day}>
                    <Button
                      style={getStatusColor(attendance[kid]?.[day])}
                      onClick={() => toggleAttendance(kid, day)}
                    >
                      {attendance[kid]?.[day] || "N"}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default PickupPage;
