const express = require("express");
const {
  createStudent,
  getAllStudents,
  getSingleStudent,
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
router.delete("/:id", (req, res) => {
  res.json({ message: "Delete a student" });
});
// update a student
router.patch("/:id", (req, res) => {
  res.json({ message: "Update a student" });
});

module.exports = router;
