import React, { useEffect, useState } from "react";
import "./Vans.css";
import AddStudent from "../components/AddStudent";
import AddEmployee from "../components/AddEmployee";

function Vans() {
  const [students, setStudents] = useState([]);
  const [vans, setVans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedVanModel, setSelectedVanModel] = useState(""); // Track the selected van model
  const [selectedVan, setSelectedVan] = useState(null); // Track the selected van
  const [showNewVanForm, setShowNewVanForm] = useState(false); // Track whether to show the new van form
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
          <select value={selectedVanModel} onChange={handleVanModelSelect}>
            <option value="">Select a Model</option>
            {vans.map((van) => (
              <option key={van._id} value={van.model}>
                {van && van.model ? van.model : "Unknown Model"}
              </option>
            ))}
          </select>

          {selectedVan && (
            <div className="selected-van-info">
              <h3>Selected Van: {selectedVan.plate}</h3>
              <h4>Students:</h4>
              <ul>
                {selectedVan.students.map((studentId) => {
                  const student = students.find((s) => s._id === studentId);
                  return <li key={student._id}>{student.name}</li>;
                })}
              </ul>
              <h4>Employees:</h4>
              <ul>
                {selectedVan.employes.map((employeeId) => {
                  const employee = employees.find((e) => e._id === employeeId);
                  return <li key={employee._id}>{employee.name}</li>;
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
