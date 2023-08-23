import { useState } from "react";
import "./StudentForm.css";
function StudentForm() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [parent, setParent] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = {
      name,
      photo,
      age,
      address,
      parent,
      parentPhone,
      parentEmail,
    };
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.message);
      console.log("error", error);
    }
    if (response.ok) {
      setName("");
      setPhoto("");
      setAge("");
      setAddress("");
      setParent("");
      setParentPhone("");
      setParentEmail("");
      setError(null);
      console.log("new student added", json);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Student</h3>
      <div className="form-container">
        <div className="form-item">
          <label>Student Name:</label>
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </div>
        <div className="form-item">
          <label>Student Photo:</label>
          <input
            type="text"
            onChange={(e) => {
              setPhoto(e.target.value);
            }}
            value={photo}
          />
        </div>
        <div className="form-item">
          <label>Student Age:</label>
          <input
            type="text"
            onChange={(e) => {
              setAge(e.target.value);
            }}
            value={age}
          />
        </div>
        <div className="form-item">
          <label>Student Address:</label>
          <input
            type="text"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            value={address}
          />
        </div>
        <div className="form-item">
          <label>Parent Name:</label>
          <input
            type="text"
            onChange={(e) => {
              setParent(e.target.value);
            }}
            value={parent}
          />
        </div>
        <div className="form-item">
          <label>Parent Phone:</label>
          <input
            type="tel"
            onChange={(e) => {
              setParentPhone(e.target.value);
            }}
            value={parentPhone}
          />
        </div>
        <div className="form-item">
          <label>Parent Email:</label>
          <input
            type="email"
            onChange={(e) => {
              setParentEmail(e.target.value);
            }}
            value={parentEmail}
          />
        </div>
        <button className="create-btn">Add Student</button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  );
}

export default StudentForm;
