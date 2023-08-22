const express = require("express");
const {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { create } = require("../models/studentModel");

const router = express.Router();

// GET all students
router.get("/", getAllStudents);
// Get a single student
router.get("/:id", getSingleStudent);
// Create a student
router.post("/", createStudent);
// delete a student
router.delete("/:id", deleteStudent);
// update a student
router.patch("/:id", updateStudent);

module.exports = router;
