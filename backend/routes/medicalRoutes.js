const express = require("express");
const router = express.Router();

const { treatAnimal } = require("../controllers/medicalController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
  "/medical/treat",
  authenticateToken,
  authorizeRoles(["Veterinarian", "Admin"]), 
  treatAnimal
);

module.exports = router;