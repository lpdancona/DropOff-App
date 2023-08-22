import React from "react";
import "./StudentDetails.css";
function StudentDetails({ student }) {
  return (
    <div className="student-details">
      <img src={student.photo} alt="" className="student-photo" />
      <div className="student-name">{student.name}</div>
      <div className="student-address">{student.address}</div>
      <div className="parent-phone">{student.phone}</div>
    </div>
  );
}

export default StudentDetails;
