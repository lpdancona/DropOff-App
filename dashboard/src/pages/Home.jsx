import React, { useEffect, useState } from "react";
import "./Home.css";
import StudentDetails from "../components/StudentDetails";

export default function Home() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("/api/students");
      const json = await response.json();
      console.log(json);

      if (response.ok) {
        setStudents(json.students);
      }
      console.log(students);
    };
    fetchStudents();
  }, []);

  return (
    <div className="home-container">
      <div className="students-container">
        <div className="student">
          {students.map((student) => (
            <StudentDetails key={student._id} student={student} />
          ))}
        </div>
      </div>
      <div className="left-container">left</div>
    </div>
  );
}
