const pool = require("../db/database");

// GET ALL
const getAnimals = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = "SELECT * FROM animals WHERE 1=1";
    let values = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND name ILIKE $${values.length}`;
    }

    if (status) {
      values.push(status);
      query += ` AND adoption_status = $${values.length}`;
    }

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// CREATE
// CREATE
const createAnimal = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      `INSERT INTO animals 
       (name, species_id, status_id, intake_date, gender, health_status, adoption_status)
       VALUES ($1, 1, 1, CURRENT_DATE, 'Male', 'Healthy', 'Available')
       RETURNING *`,
      [name]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.log("CREATE ERROR:", error); // 🔥 important
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// DELETE
const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM animals WHERE animal_id = $1",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Animal deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// UPDATE
const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      "UPDATE animals SET name = $1 WHERE animal_id = $2 RETURNING *",
      [name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Animal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Animal updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAnimals,
  createAnimal,
  deleteAnimal,
  updateAnimal,
};