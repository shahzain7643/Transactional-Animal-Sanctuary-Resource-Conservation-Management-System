console.log("Animals routes loaded");
const express = require("express");
const router = express.Router();

const {
  getAnimals,
  createAnimal,
  deleteAnimal,
  updateAnimal
} = require("../controllers/animalsController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// GET
router.get(
  "/animals",
  authMiddleware,
  authorizeRoles(["Admin", "Veterinarian"]),
  getAnimals
);

// POST
router.post(
  "/animals",
  authMiddleware,
  authorizeRoles(["Admin"]),
  createAnimal
);

// PUT (IMPORTANT)
router.put(
  "/animals/:id",
  authMiddleware,
  authorizeRoles(["Admin"]),
  updateAnimal
);

// DELETE
router.delete(
  "/animals/:id",
  authMiddleware,
  authorizeRoles(["Admin"]),
  deleteAnimal
);

module.exports = router;