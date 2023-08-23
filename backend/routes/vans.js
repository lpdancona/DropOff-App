const express = require("express");
const {
  createVan,
  getAllVans,
  getSingleVan,
  updateVan,
  deleteVan,
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

module.exports = router;
