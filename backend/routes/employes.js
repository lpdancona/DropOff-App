const express = require("express");
const {
  createEmploye,
  getAllEmployes,
  getSingleEmploye,
  updateEmploye,
  deleteEmploye,
} = require("../controllers/employeController");
const { create } = require("../models/employeModel");
const router = express.Router();

// GET all employes
router.get("/", getAllEmployes);
// Get a single employe
router.get("/:id", getSingleEmploye);
// Create a employe
router.post("/", createEmploye);
// delete a employe
router.delete("/:id", deleteEmploye);
// update a employe
router.patch("/:id", updateEmploye);

module.exports = router;
