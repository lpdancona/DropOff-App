import React, { useEffect, useState } from "react";
import "./Students.css";
import StudentForm from "../components/StudentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import avatar from "../docs/avatar-image.png";
function Students() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [mode, setMode] = useState("list");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAddress, setUpdatedAddress] = useState("");
  const [updatedAge, setUpdatedAge] = useState("");
  const [updatedParentNumber, setUpdatedParentNumber] = useState("");
  const [updatedParentEmail, setUpdatedParentEmail] = useState("");
  const [updatedPhoto, setUpdatedPhoto] = useState("");
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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;

  const filteredStudents = students.filter((student) => {
    return (
      (nameFilter === "" ||
        student.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (addressFilter === "" ||
        student.address.toLowerCase().includes(addressFilter.toLowerCase()))
    );
  });

  const displayedStudents = filteredStudents.slice(startIndex, endIndex);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setUpdatedName(student.name);
    setUpdatedAddress(student.address);
    setUpdatedAge(student.age);
    setUpdatedParentNumber(student.parentPhone);
    setUpdatedParentEmail(student.parentEmail);
    setUpdatedPhoto(student.photo);
    setMode("details");
  };
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setMode("delete");
  };
  const handleDeleteStudent = async () => {
    try {
      const response = await fetch(`/api/students/${selectedStudent._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedStudents = students.filter(
          (student) => student._id !== selectedStudent._id
        );
        setStudents(updatedStudents);
        setSelectedStudent(null);
        setMode("list");
      } else {
        console.error("Failed to delete student.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await fetch(`/api/students/${selectedStudent._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: updatedName,
          address: updatedAddress,
          age: updatedAge,
          parentNumber: updatedParentNumber,
          parentEmail: updatedParentEmail,
          photo: updatedPhoto,
        }),
      });

      if (response.ok) {
        const updatedStudents = students.map((student) =>
          student._id === selectedStudent._id
            ? {
                ...student,
                name: updatedName,
                address: updatedAddress,
                age: updatedAge,
                parentNumber: updatedParentNumber,
                parentEmail: updatedParentEmail,
                photo: updatedPhoto,
              }
            : student
        );
        setStudents(updatedStudents);

        setSelectedStudent(null);
        setMode("list");
        setUpdatedName("");
        setUpdatedAddress("");
        setUpdatedAge("");
        setUpdatedParentNumber("");
        setUpdatedParentEmail("");
        setUpdatedPhoto("");
      } else {
        console.error("Failed to update student.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

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
        <div className="home-container">
          <div className="students-container">
            {mode === "list" && (
              <div>
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
                    placeholder="Filter by Address"
                    value={addressFilter}
                    onChange={(e) => setAddressFilter(e.target.value)}
                  />
                </div>
                <div className="student">
                  {displayedStudents.map((student) => (
                    <div
                      className="student-details-container"
                      key={student._id}
                    >
                      <img
                        src={student.photo}
                        alt={avatar}
                        className="student-photo"
                      />
                      <div className="student-details">
                        <div className="student-name">{student.name}</div>
                        <div className="student-address">{student.address}</div>
                      </div>
                      <div className="student-details-btn">
                        <button
                          onClick={() => handleStudentClick(student)}
                          className="btn btn-student-edit"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          className="btn btn-student-delete"
                          onClick={() => {
                            handleDeleteClick(student);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="btn"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} beat />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={endIndex >= filteredStudents.length}
                    className="btn"
                  >
                    <FontAwesomeIcon icon={faArrowRight} beat />
                  </button>
                </div>
              </div>
            )}
            {mode === "details" && selectedStudent && (
              <div className="update-student-container">
                <h2>Update Student</h2>
                <div className="update-student">
                  <h4>{selectedStudent.name}</h4>
                  <form onSubmit={handleUpdateStudent}>
                    <label>Name:</label>
                    <input
                      type="text"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                    <label>Photo:</label>
                    <input
                      type="text"
                      value={updatedPhoto}
                      onChange={(e) => setUpdatedParentEmail(e.target.value)}
                    />
                    <label>Address:</label>
                    <input
                      type="text"
                      value={updatedAddress}
                      onChange={(e) => setUpdatedAddress(e.target.value)}
                    />
                    <label>Age:</label>
                    <input
                      type="text"
                      value={updatedAge}
                      onChange={(e) => setUpdatedAge(e.target.value)}
                    />
                    <label>Parent Number:</label>
                    <input
                      type="text"
                      value={updatedParentNumber}
                      onChange={(e) => setUpdatedParentNumber(e.target.value)}
                    />
                    <label>Parent Email:</label>
                    <input
                      type="text"
                      value={updatedParentEmail}
                      onChange={(e) => setUpdatedParentEmail(e.target.value)}
                    />
                    <button type="submit" className="btn">
                      Update Student
                    </button>
                    <button onClick={() => setMode("list")} className="btn">
                      Back to List
                    </button>
                  </form>
                </div>
              </div>
            )}
            {mode === "delete" && selectedStudent && (
              <div className="delete-student-container">
                <h2>Delete Student</h2>
                <div className="delete-student">
                  <h4>{selectedStudent.name}</h4>
                  <p>Are you sure you want to delete this student?</p>
                  <button onClick={handleDeleteStudent} className="btn">
                    Yes
                  </button>
                  <button onClick={() => setMode("list")} className="btn">
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="left-container">
            <StudentForm onStudentAdded={handleStudentAdded} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;
