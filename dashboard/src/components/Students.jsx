import React, { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Kid } from "../models";
import "./Students.css";
import StudentForm from "../components/StudentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
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
  const [updatedParent2Email, setUpdatedParent2Email] = useState("");
  const [updatedParent1Email, setUpdatedParent1Email] = useState("");
  const [updatedPhoto, setUpdatedPhoto] = useState("");
  const studentsPerPage = 4;

  useEffect(() => {
    const fetchKids = async () => {
      try {
        const kidsData = await DataStore.query(Kid);
        setStudents(kidsData);
      } catch (error) {
        console.error("Error fetching kids", error);
      }
    };
    fetchKids();
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
        student.dropOffAddress
          .toLowerCase()
          .includes(addressFilter.toLowerCase()))
    );
  });

  const displayedStudents = filteredStudents.slice(startIndex, endIndex);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setUpdatedName(student.name);
    setUpdatedAddress(student.dropOffAddress);
    setUpdatedAge(student.birthDate);
    setUpdatedParent1Email(student.parent1Email);
    setUpdatedParent2Email(student.parent2Email);
    setUpdatedPhoto(student.photo);
    setMode("details");
  };
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setMode("delete");
  };
  const handleDeleteStudent = async () => {
    if (!selectedStudent) {
      return;
    }

    try {
      // Use DataStore.delete to delete the Kid
      await DataStore.delete(Kid, selectedStudent.id);

      // Filter out the deleted Kid from the students state
      const updatedStudents = students.filter(
        (student) => student.id !== selectedStudent.id
      );

      setStudents(updatedStudents);
      setSelectedStudent(null);
      setMode("list");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) {
      return;
    }
    try {
      console.log("Updating student...");
      // Use DataStore.save to update the Kid
      const updatedKid = await DataStore.save(
        Kid.copyOf(selectedStudent, (updated) => {
          updated.name = updatedName;
          updated.address = updatedAddress;
          updated.age = updatedAge;
          updated.parent1Email = updatedParent1Email;
          updated.parent2Email = updatedParent2Email;
          updated.photo = updatedPhoto;
        })
      );
      // Update the students state with the updatedKid
      const updatedStudents = students.map((student) =>
        student.id === updatedKid.id ? updatedKid : student
      );
      setStudents(updatedStudents);
      setSelectedStudent(null);
      setMode("list");
      setUpdatedName("");
      setUpdatedAddress("");
      setUpdatedAge("");
      setUpdatedParent1Email("");
      setUpdatedParent2Email("");
      setUpdatedPhoto("");
      console.log("Student updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleStudentAdded = async () => {
    try {
      // Use DataStore.query to fetch students
      const studentsData = await DataStore.query(Kid);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const handleBackToList = (e) => {
    e.preventDefault();
    setMode("list");
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
                    <div className="student-details-container" key={student.id}>
                      <img src={student.photo} className="student-photo" />
                      <div className="student-details">
                        <div className="student-name">{student.name}</div>
                        <div className="student-address">
                          {student.dropOffAddress}
                        </div>
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
                      onChange={(e) => setUpdatedPhoto(e.target.value)}
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
                    <label>Parent 1 Email:</label>
                    <input
                      type="text"
                      value={updatedParent1Email || ""}
                      onChange={(e) => setUpdatedParent1Email(e.target.value)}
                    />
                    <label>Parent 2 Email:</label>
                    <input
                      type="text"
                      value={updatedParent2Email || ""}
                      onChange={(e) => setUpdatedParent2Email(e.target.value)}
                    />
                    <button type="submit" className="btn">
                      Update Student
                    </button>
                    <button onClick={handleBackToList} className="btn">
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
