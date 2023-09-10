const express = require("express");
const {
  createVan,
  getAllVans,
  getSingleVan,
  updateVan,
  deleteVan,
  addStudentToVan,
  addEmployeToVan,
  unaddStudent,
  unaddEmploye,
} = require("../controllers/vanController");
const { create } = require("../models/vanModel");

const router = express.Router();

// GET all vans
router.get("/", getAllVans);
// Get a single van
router.get("/:id", getSingleVan);
// Create a van
router.post("/", createVan);
// delete a van
router.delete("/:id", deleteVan);
// update a van
router.patch("/:id", updateVan);
// add a student to a van
router.post("/addStudent", addStudentToVan);
// add a employee to van
router.post("/addEmployee", addEmployeToVan);
// unadd a student
router.patch("/:id/unadd-student", unaddStudent);
// unadd an employee
router.patch("/:id/unadd-employe", unaddEmploye);
module.exports = router;
