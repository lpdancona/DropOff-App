const Van = require("../models/vanModel");
const Weekday = require("../models/weekdayModel");
const mongoose = require("mongoose");

const getAllWeekdays = async (req, res) => {
  try {
    const weekdays = await Weekday.find().sort({ createdAt: -1 });
    res.status(200).json({ weekdays });
  } catch (err) {
    res.status(500).json({ err });
  }
};
// get a single van
const getSingleWeekday = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Weekday does not exist" });
  }
  const weekday = await Weekday.findById(id);
  if (!weekday) {
    return res.status(404).json({ message: "Weekday does not exist" });
  }
  res.status(200).json({ weekday });
};
// create a van
const createWeekday = async (req, res) => {
  const { weekday: newWeekday } = req.body;
  try {
    const weekday = await Weekday.create({
      weekday: newWeekday,
      vans: [],
    });
    res.status(201).json({ weekday });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};

// delete a van
const deleteWeekday = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Weekday does not exist" });
  }
  const weekday = await Weekday.findByIdAndRemove({ _id: id });
  if (!weekday) {
    return res.status(400).json({ message: "Weekday does not exist" });
  }
  res.status(200).json({ message: "Weekday deleted successfully." });
};
// update a van
const updateWeekday = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Weekday does not exist" });
  }
  const weekday = await Weekday.findOneAndUpdate({ _id: id }, { ...req.body });
  if (!weekday) {
    return res.status(400).json({ message: "Weekday does not exist" });
  }
  res.status(200).json({ message: "Weekday updated successfully." });
};

// add a student to a van

const addVanToWeekday = async (req, res) => {
  const { weekdayId, vanId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(weekdayId)) {
      return res.status(404).json({ message: "Weekday does not exist" });
    }
    if (!mongoose.Types.ObjectId.isValid(vanId)) {
      return res.status(404).json({ message: "Van does not exist" });
    }
    const weekday = await Weekday.findById(weekdayId);
    const van = await Van.findById(vanId);

    if (!weekday || !van) {
      return res.status(404).json({ message: "Van or weekday does not exist" });
    }

    weekday.vans.push(vanId); // Corrected field name to "vans"
    await weekday.save();
    res.status(200).json({ message: "van added successfully." });
  } catch (err) {
    res.status(500).json({ err });
  }
};
const getVansForWeekday = async (req, res) => {
  const { selectedWeekday } = req.params;

  // Check if the selectedWeekday is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(selectedWeekday)) {
    return res.status(400).json({ message: "Invalid weekday ID" });
  }

  try {
    // Find the weekday by its ID
    const weekday = await Weekday.findById(selectedWeekday);

    // Check if the weekday exists
    if (!weekday) {
      return res.status(404).json({ message: "Weekday not found" });
    }

    // Fetch the vans associated with the weekday
    const vans = await Van.find({ _id: { $in: weekday.vans } });

    res.status(200).json({ vans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllWeekdays,
  getSingleWeekday,
  createWeekday,
  deleteWeekday,
  updateWeekday,
  addVanToWeekday,
  getVansForWeekday,
};
