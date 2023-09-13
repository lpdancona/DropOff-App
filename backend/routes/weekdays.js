const express = require("express");
const {
  createWeekday,
  getAllWeekdays,
  getSingleWeekday,
  updateWeekday,
  deleteWeekday,
  addVanToWeekday,
  getVansForWeekday,
} = require("../controllers/weekdayController");
const { create } = require("../models/weekdayModel");

const router = express.Router();

// GET all vans
router.get("/", getAllWeekdays);
// Get a single van
router.get("/:id", getSingleWeekday);
// Create a van
router.post("/", createWeekday);
// delete a van
router.delete("/:id", deleteWeekday);
// update a van
router.patch("/:id", updateWeekday);
// add a student to a van
router.post("/addVan", addVanToWeekday);
// get vans for a weekday
router.get("/:selectedWeekday/vans", getVansForWeekday);
module.exports = router;
