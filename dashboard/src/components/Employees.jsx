import React, { useEffect, useState } from "react";
import "./Employees.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import EmployeeForm from "./EmployeeForm";
function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [mode, setMode] = useState("list");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedRole, setUpdatedRole] = useState("");
  const [updatedPhoto, setUpdatedPhoto] = useState("");
  const employeesPerPage = 4;

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch(
        "https://drop-off-app-dere.onrender.com/api/employes"
      );
      const json = await response.json();

      if (response.ok) {
        setEmployees(json.employes);
      }
    };
    fetchEmployees();
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;

  const filteredEmployees = employees.filter((employee) => {
    return (
      nameFilter === "" ||
      employee.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  });

  const displayedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setUpdatedName(employee.name);
    setUpdatedPhoto(employee.photo);
    setUpdatedRole(employee.role);
    setMode("details");
  };
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setMode("delete");
  };
  const handleDeleteEmployee = async () => {
    try {
      const response = await fetch(
        `https://drop-off-app-dere.onrender.com/api/employes/${selectedEmployee._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedEmployees = employees.filter(
          (employee) => employee._id !== selectedEmployee._id
        );
        setEmployees(updatedEmployees);
        setSelectedEmployee(null);
        setMode("list");
      } else {
        console.error("Failed to delete Employee.");
      }
    } catch (error) {
      console.error("Error deleting Employee:", error);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(
        `https://drop-off-app-dere.onrender.com/api/employes/${selectedEmployee._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedName,
            photo: updatedPhoto,
            role: updatedRole,
          }),
        }
      );

      if (response.ok) {
        const updatedEmployees = employees.map((employee) =>
          employee._id === selectedEmployee._id
            ? {
                ...employee,
                name: updatedName,
                photo: updatedPhoto,
                role: updatedRole,
              }
            : employee
        );
        setEmployees(updatedEmployees);

        setSelectedEmployee(null);
        setMode("list");
        setUpdatedName("");
        setUpdatedPhoto("");
        setUpdatedRole("");
      } else {
        console.error("Failed to update Employee.");
      }
    } catch (error) {
      console.error("Error updating Employee:", error);
    }
  };

  const handleEmployeeAdded = async () => {
    try {
      const response = await fetch(
        "https://drop-off-app-dere.onrender.com/api/employes"
      );
      const json = await response.json();

      if (response.ok) {
        setEmployees(json.employes);
      }
    } catch (error) {
      console.error("Error fetching Employees:", error);
    }
  };

  return (
    <div className="home-main">
      <div className="home">
        <div className="home-container">
          <div className="students-container">
            {mode === "list" && (
              <div>
                <h3>Employees</h3>
                <div className="filters">
                  <input
                    type="text"
                    placeholder="Filter by Name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
                <div className="student">
                  {displayedEmployees.map((employee) => (
                    <div
                      className="student-details-container"
                      key={employee._id}
                    >
                      <img
                        src={employee.photo}
                        alt=""
                        className="student-photo"
                      />
                      <div className="student-details">
                        <div className="student-name">{employee.name}</div>
                        <div className="student-address">{employee.role}</div>
                      </div>
                      <div className="student-details-btn">
                        <button
                          onClick={() => handleEmployeeClick(employee)}
                          className="btn btn-student-edit"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          className="btn btn-student-delete"
                          onClick={() => {
                            handleDeleteClick(employee);
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
                    disabled={endIndex >= filteredEmployees.length}
                    className="btn"
                  >
                    <FontAwesomeIcon icon={faArrowRight} beat />
                  </button>
                </div>
              </div>
            )}
            {mode === "details" && selectedEmployee && (
              <div className="update-student-container">
                <h2>Update Employee</h2>
                <div className="update-student">
                  <h4>{selectedEmployee.name}</h4>
                  <form onSubmit={handleUpdateEmployee}>
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
                    <label>Role:</label>
                    <input
                      type="text"
                      value={updatedRole}
                      onChange={(e) => setUpdatedRole(e.target.value)}
                    />
                    <button type="submit" className="btn">
                      Update Employee
                    </button>
                    <button onClick={() => setMode("list")} className="btn">
                      Back to List
                    </button>
                  </form>
                </div>
              </div>
            )}
            {mode === "delete" && selectedEmployee && (
              <div className="delete-student-container">
                <h2>Delete Employee</h2>
                <div className="delete-student">
                  <h4>{selectedEmployee.name}</h4>
                  <p>Are you sure you want to delete this student?</p>
                  <button onClick={handleDeleteEmployee} className="btn">
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
            <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;
