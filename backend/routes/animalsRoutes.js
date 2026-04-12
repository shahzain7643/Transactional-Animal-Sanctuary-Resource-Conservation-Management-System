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

router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Veterinarian", "Adopter"),
  getAnimals
);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin"),
  createAnimal
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  updateAnimal
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  deleteAnimal
);

module.exports = router;