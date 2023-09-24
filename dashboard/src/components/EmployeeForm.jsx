import { useState } from "react";
import "./StudentForm.css";
function EmployeeForm({ onEmployeeAdded }) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employe = {
      name,
      photo,
      role,
    };
    const response = await fetch(
      "https://drop-off-app-dere.onrender.com/api/employes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employe),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
      console.log("error", error);
      alert("Failed to add Employee.");
    }
    if (response.ok) {
      setName("");
      setPhoto("");
      setRole("");
      setError(null);
      console.log("new employee added", json);
      alert("New employee added!");
      onEmployeeAdded();
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Employee</h3>
      <div className="form-container">
        <div className="form-item">
          <label>Employee Name:</label>
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </div>
        <div className="form-item">
          <label>Employee Photo:</label>
          <input
            type="text"
            onChange={(e) => {
              setPhoto(e.target.value);
            }}
            value={photo}
          />
        </div>
        <div className="form-item">
          <label>Employee Role:</label>
          <input
            type="text"
            onChange={(e) => {
              setRole(e.target.value);
            }}
            value={role}
          />
        </div>
        <button className="create-btn">Add Employee</button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  );
}

export default EmployeeForm;
