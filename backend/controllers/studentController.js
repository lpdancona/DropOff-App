const Student = require("../models/studentModel");
const mongoose = require("mongoose");
// GET all students

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ students });
  } catch (err) {
    res.status(500).json({ err });
  }
};

// Get a single student

const getSingleStudent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Student does not exist" });
  }
  const student = await Student.findById(id);
  if (!student) {
    return res.status(404).json({ message: "Student does not exist" });
  }
  res.status(200).json({ student });
};
// Create a student
const createStudent = async (req, res) => {
  const { name, photo, age, address } = req.body;
  try {
    const student = await Student.create({ name, photo, age, address });
    res.status(201).json({ student });
  } catch (err) {
    res.status(500).json({ err });
  }
};

// delete a student

// update a student

module.exports = {
  getAllStudents,
  getSingleStudent,
  createStudent,
};
