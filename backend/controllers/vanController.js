const Van = require("../models/vanModel");
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
module.exports = {
  getAllVans,
  getSingleVan,
  createVan,
  deleteVan,
  updateVan,
};
