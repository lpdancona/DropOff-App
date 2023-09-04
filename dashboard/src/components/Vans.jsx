import React, { useEffect, useState } from "react";
import "./Vans.css";
import AddStudent from "../components/AddStudent";
import AddEmployee from "../components/AddEmployee";
function Vans() {
  const [students, setStudents] = useState([]);
  const [vans, setVans] = useState([]);
  const [employees, setEmployees] = useState([]);
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
  return (
    <div className="home">
      <div className="home-container"></div>
      <div className="vans-container">
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
