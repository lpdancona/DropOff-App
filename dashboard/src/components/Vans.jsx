import React, { useEffect, useState } from "react";
import "./Vans.css";
import AddStudent from "../components/AddStudent";
import AddEmployee from "../components/AddEmployee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";

function Vans() {
  const [students, setStudents] = useState([]);
  const [vans, setVans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedVanModel, setSelectedVanModel] = useState("");
  const [selectedVan, setSelectedVan] = useState(null);
  const [showNewVanForm, setShowNewVanForm] = useState(false);
  const [newVanData, setNewVanData] = useState({
    plate: "",
    model: "",
    year: "",
  });

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const response = await fetch("/api/vans");
        if (response.ok) {
          const json = await response.json();
          setVans(json.vans);
        } else {
          console.error("Failed to fetch vans data");
        }
      } catch (error) {
        console.error("Error fetching vans:", error);
      }
    };
    fetchVans();
  }, []);

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

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await fetch("/api/employes");
      const json = await response.json();

      if (response.ok) {
        setEmployees(json.employes);
      }
    };
    fetchEmployees();
  }, []);

  // Function to handle van model selection
  const handleVanModelSelect = (e) => {
    const model = e.target.value;
    setSelectedVanModel(model);

    // Find the first van with the selected model
    const selectedVanData = vans.find((van) => van && van.model === model);
    setSelectedVan(selectedVanData);
  };

  // Function to handle input changes for new van data
  const handleNewVanChange = (e) => {
    const { name, value } = e.target;
    setNewVanData({
      ...newVanData,
      [name]: value,
    });
  };

  const createNewVan = async () => {
    try {
      const response = await fetch("/api/vans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVanData),
      });

      if (response.ok) {
        // Refresh the page after creating a new van
        window.location.reload();
      } else {
        console.error("Failed to create a new van");
      }
    } catch (error) {
      console.error("Error creating a new van:", error);
    }
  };
  const handleUnaddStudent = async (studentId) => {
    try {
      const response = await fetch(
        `/api/vans/${selectedVan._id}/unadd-student`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId }),
        }
      );

      if (response.ok) {
        // Update the selected van's data after unadding
        const updatedVan = { ...selectedVan };
        updatedVan.students = updatedVan.students.filter(
          (id) => id !== studentId
        );
        setSelectedVan(updatedVan);
      } else {
        console.error("Failed to unadd student from the van.");
      }
    } catch (error) {
      console.error("Error unadding student from the van:", error);
    }
  };
  const handleUnaddEmployee = async (employeId) => {
    try {
      const response = await fetch(
        `/api/vans/${selectedVan._id}/unadd-employe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeId }),
        }
      );

      if (response.ok) {
        // Update the selected van's data after unadding
        const updatedVan = { ...selectedVan };
        updatedVan.employes = updatedVan.employes.filter(
          (id) => id !== employeId
        );
        setSelectedVan(updatedVan);
      } else {
        console.error("Failed to unadd employee from the van.");
      }
    } catch (error) {
      console.error("Error unadding employee from the van:", error);
    }
  };

  return (
    <div className="home">
      <div className="home-container"></div>
      <div className="create-van-dropdown">
        <button
          className="create-van-button"
          onClick={() => setShowNewVanForm(!showNewVanForm)}
        >
          Create Van
        </button>
        <div
          className={`create-new-van-form ${showNewVanForm ? "active" : ""}`}
        >
          <h3>Create New Van</h3>
          <input
            type="text"
            name="plate"
            placeholder="Plate"
            value={newVanData.plate}
            onChange={handleNewVanChange}
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={newVanData.model}
            onChange={handleNewVanChange}
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={newVanData.year}
            onChange={handleNewVanChange}
          />
          <button onClick={createNewVan}>Create Van</button>
        </div>
      </div>
      <div className="vans-container">
        <div className="vans">
          <h2>Vans</h2>
          <label>Select a Van Model: </label>
          <select
            value={selectedVanModel}
            onChange={handleVanModelSelect}
            className="model-select"
          >
            <option value="">Select a Model</option>
            {vans.map((van) => (
              <option key={van._id} value={van.model}>
                {van && van.model ? van.model : "Unknown Model"}
              </option>
            ))}
          </select>

          {selectedVan && (
            <div className="selected-van-info">
              <h3>Selected Van: {selectedVan.model}</h3>
              <h4>Employees:</h4>
              <ul className="van-employees">
                {selectedVan.employes.map((employeeId) => {
                  const employee = employees.find((e) => e._id === employeeId);
                  return (
                    <li key={employee._id} className="van-employee">
                      <img src={employee.photo} alt="" />
                      <div>{employee.name}</div>
                      <div>{employee.role}</div>
                      <button onClick={() => handleUnaddEmployee(employee._id)}>
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
              <h4>Students:</h4>
              <ul className="van-students">
                {selectedVan.students.map((studentId) => {
                  const student = students.find((s) => s._id === studentId);
                  return (
                    <li key={student._id} className="van-student">
                      <img src={student.photo} alt="" />

                      <div className="van-student-info">
                        <div className="van-student-name">{student.name}</div>
                        <div className="van-student-address">
                          {student.address}
                        </div>
                      </div>
                      <button onClick={() => handleUnaddStudent(student._id)}>
                        <FontAwesomeIcon icon={faUserXmark} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="add-van-info">
          <div className="add-student">
            <AddStudent students={students} vans={vans} />
          </div>
          <div className="add-employee">
            <AddEmployee employees={employees} vans={vans} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vans;
