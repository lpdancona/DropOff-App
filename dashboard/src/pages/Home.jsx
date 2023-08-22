import React, { useEffect, useState } from "react";
import "./Home.css";
import StudentDetails from "../components/StudentDetails";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const displayedStudents = students.slice(startIndex, endIndex);

  return (
    <div className="home-container">
      <div className="students-container">
        <div className="student">
          {displayedStudents.map((student) => (
            <StudentDetails key={student._id} student={student} />
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={endIndex >= students.length}
          >
            Next
          </button>
        </div>
      </div>
      <div className="left-container">left</div>
    </div>
  );
}
