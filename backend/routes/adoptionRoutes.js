const express = require("express");
const router = express.Router();

const {
  applyForAdoption,
  getApplications,
  approveAdoption,
  rejectAdoption
} = require("../controllers/adoptionController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// APPLY (Adopter)
router.post(
  "/apply",
  authMiddleware,
  authorizeRoles("Adopter"),
  applyForAdoption
);

// GET ALL (Admin)
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin"),
  getApplications
);

// APPROVE
router.post(
  "/approve",
  authMiddleware,
  authorizeRoles("Admin"),
  approveAdoption
);

// REJECT
router.post(
  "/reject",
  authMiddleware,
  authorizeRoles("Admin"),
  rejectAdoption
);

module.exports = router;