import React, { useState } from "react";
import "./AddStudent.css";

export default function AddStudent({ employees, vans }) {
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchVan, setSearchVan] = useState("");
  const [message, setMessage] = useState("");

  const handleEmployeeSelect = (EmployeeId) => {
    setSearchEmployee(EmployeeId);
  };

  const handleVanSelect = (vanId) => {
    setSearchVan(vanId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/vans/addEmployee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vanId: searchVan, employeeId: searchEmployee }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage("Failed to add Employee to van.");
    }
    if (response.ok) {
      setSearchVan("");
      setSearchEmployee("");
      alert("Employee added to van!");
    }
  };

  return <div>employee</div>;
}
