const express = require("express");
const router = express.Router();

const { approveAdoption } = require("../controllers/adoptionController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
  "/adoptions/approve",
  authenticateToken,
  authorizeRoles(["Admin"]),
  approveAdoption
);

module.exports = router;