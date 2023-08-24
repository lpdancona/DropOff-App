const Employe = require("../models/employeModel");
const mongoose = require("mongoose");

// GET all employes

const getAllEmployes = async (req, res) => {
  try {
    const employes = await Employe.find().sort({ createdAt: -1 });
    res.status(200).json({ employes });
  } catch (err) {
    res.status(500).json({ err });
  }
}

// Get a single employe

const getSingleEmploye = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Employe does not exist" });
  }
  const employe = await Employe.findById(id);
  if (!employe) {
    return res.status(404).json({ message: "Employe does not exist" });
  }
  res.status(200).json({ employe });
}
// Create a employe
const createEmploye = async (req, res) => {
  const { name, photo, role } = req.body;
  try {
    const employe = await Employe.create({
      name,
      photo,
      role,
    });
    res.status(201).json({ employe });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
}

// delete a employe

const deleteEmploye = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Employe does not exist" });
  }
  const employe = await Employe.findByIdAndRemove({ _id: id });
  if (!employe) {
    return res.status(400).json({ message: "Employe does not exist" });
  }
  res.status(200).json({ message: "Employe deleted successfully." });
}
 // update a employe

const updateEmploye = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Employe does not exist" });
  }
  const student = await Employe.findByIdAndUpdate({ _id: id }, { ...req.body });
  if (!student) {
    return res.status(400).json({ message: "Employe does not exist" });
  }
  res.status(200).json({ message: "Employe updated successfully." });
}

module.exports = {
  getAllEmployes,
  getSingleEmploye,
  createEmploye,
  deleteEmploye,
  updateEmploye,
};