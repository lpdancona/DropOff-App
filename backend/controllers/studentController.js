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
  const { name, photo, age, address, parent, parentPhone, parentEmail } =
    req.body;
  try {
    const student = await Student.create({
      name,
      photo,
      age,
      address,
      parent,
      parentPhone,
      parentEmail,
    });
    res.status(201).json({ student });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};

// delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Student does not exist" });
  }
  const student = await Student.findByIdAndRemove({ _id: id });
  if (!student) {
    return res.status(400).json({ message: "Student does not exist" });
  }
  res.status(200).json({ message: "Student deleted successfully." });
};

// update a student

const updateStudent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Student does not exist" });
  }
  const student = await Student.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!student) {
    return res.status(400).json({ message: "Student does not exist" });
  }
  res.status(200).json({ message: "Student updated successfully." });
};

module.exports = {
  getAllStudents,
  getSingleStudent,
  createStudent,
  deleteStudent,
  updateStudent,
};
