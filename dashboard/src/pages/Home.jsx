import React, { useEffect, useState } from "react";
import "./Home.css";

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
    <div className="home">
      <div className="students">
        {students.map((student) => (
          <p key={student._id}>{student.name}</p>
        ))}
      </div>
    </div>
  );
}
