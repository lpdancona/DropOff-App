const Van = require("../models/vanModel");
const Student = require("../models/studentModel");
const Employe = require("../models/employeModel");
const mongoose = require("mongoose");
// get all vans
const getAllVans = async (req, res) => {
  try {
    const vans = await Van.find().sort({ createdAt: -1 });
    res.status(200).json({ vans });
  } catch (err) {
    res.status(500).json({ err });
  }
};
// get a single van
const getSingleVan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Van does not exist" });
  }
  const van = await Van.findById(id);
  if (!van) {
    return res.status(404).json({ message: "Van does not exist" });
  }
  res.status(200).json({ van });
};
// create a van
const createVan = async (req, res) => {
  const { plate, model, year } = req.body;
  try {
    const van = await Van.create({
      plate,
      model,
      year,
      students: [],
      employes: [],
    });
    res.status(201).json({ van });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};
// delete a van
const deleteVan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Van does not exist" });
  }
  const van = await Van.findByIdAndRemove({ _id: id });
  if (!van) {
    return res.status(400).json({ message: "Van does not exist" });
  }
  res.status(200).json({ message: "Van deleted successfully." });
};
// update a van
const updateVan = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Van does not exist" });
  }
  const van = await Van.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!van) {
    return res.status(400).json({ message: "Van does not exist" });
  }
  res.status(200).json({ message: "Van updated successfully." });
};

// add a student to a van

// add a student to a van
const addStudentToVan = async (req, res) => {
  const { vanId, studentId } = req.body; // Extract van ID and student ID from request body

  try {
    if (!mongoose.Types.ObjectId.isValid(vanId)) {
      return res.status(404).json({ message: "Van does not exist" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(404).json({ message: "Student does not exist" });
    }

    // Find the student and van by their IDs
    const student = await Student.findById(studentId);
    const van = await Van.findById(vanId);

    if (!student || !van) {
      return res.status(404).json({ message: "Student or van does not exist" });
    }

    // Assign the student to the van
    van.students.push(student._id);
    await van.save();

    res.status(201).json({ student, van });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};

// add an employe to van

// add an employe to van
const addEmployeToVan = async (req, res) => {
  const { vanId, employeId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(vanId)) {
      return res.status(404).json({ message: "Van does not exist" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeId)) {
      return res.status(404).json({ message: "Employee does not exist" });
    }

    // Find the student and van by their IDs
    const employe = await Employe.findById(employeId);
    const van = await Van.findById(vanId);

    if (!employe || !van) {
      return res
        .status(404)
        .json({ message: "Employee or van does not exist" });
    }

    // Assign the student to the van
    van.employes.push(employe._id);
    await van.save();

    res.status(201).json({ employe, van });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};
const unaddStudent = async (req, res) => {
  try {
    const vanId = req.params.id;
    const studentId = req.body.studentId;

    // Find the van by ID
    const van = await Van.findById(vanId);

    if (!van) {
      return res.status(404).json({ message: "Van not found" });
    }

    // Remove the student from the van's students array
    van.students = van.students.filter((id) => id.toString() !== studentId);

    // Save the updated van
    await van.save();

    res.json({ message: "Student removed from the van" });
  } catch (error) {
    console.error("Error unadding student from van:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const unaddEmploye = async (req, res) => {
  try {
    const vanId = req.params.id;
    const employeId = req.body.employeId;

    // Find the van by ID
    const van = await Van.findById(vanId);

    if (!van) {
      return res.status(404).json({ message: "Van not found" });
    }

    // Remove the employee from the van's employees array
    van.employes = van.employes.filter((id) => id.toString() !== employeId);

    // Save the updated van
    await van.save();

    res.json({ message: "Employee removed from the van" });
  } catch (error) {
    console.error("Error unadding employee from van:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllVans,
  getSingleVan,
  createVan,
  deleteVan,
  updateVan,
  addStudentToVan,
  addEmployeToVan,
  unaddStudent,
  unaddEmploye,
};
