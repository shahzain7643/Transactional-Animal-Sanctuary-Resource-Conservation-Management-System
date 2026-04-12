const pool = require("../db/database");

//  APPLY FOR ADOPTION (ADOPTER)
const applyForAdoption = async (req, res) => {
  const client = await pool.connect();

  try {
    const adopter_id = req.user.user_id;
    const { animal_id } = req.body;

    await client.query("BEGIN");

    // prevent duplicate
    const existing = await client.query(
      `SELECT * FROM adoptionapplications
       WHERE animal_id=$1 AND adopter_id=$2`,
      [animal_id, adopter_id]
    );

    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Already applied"
      });
    }

    const result = await client.query(
      `INSERT INTO adoptionapplications (animal_id, adopter_id)
       VALUES ($1,$2)
       RETURNING *`,
      [animal_id, adopter_id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Application submitted",
      data: result.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");

    res.status(500).json({
      message: err.message
    });
  } finally {
    client.release();
  }
};


//  GET ALL APPLICATIONS (ADMIN)
const getApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT aa.*, a.name AS animal_name, u.full_name AS adopter_name
      FROM adoptionapplications aa
      JOIN animals a ON aa.animal_id = a.animal_id
      JOIN users u ON aa.adopter_id = u.user_id
      ORDER BY aa.application_date DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//  APPROVE (ADMIN)
const approveAdoption = async (req, res) => {
  const client = await pool.connect();

  try {
    const { application_id } = req.body;

    await client.query("BEGIN");

    const application = await client.query(
      `SELECT * FROM adoptionapplications WHERE application_id=$1`,
      [application_id]
    );

    if (application.rows.length === 0) {
      throw new Error("Application not found");
    }

    const animal_id = application.rows[0].animal_id;

    // update application
    await client.query(
      `UPDATE adoptionapplications
       SET status='Approved', review_date=NOW()
       WHERE application_id=$1`,
      [application_id]
    );

    // update animal
    await client.query(
      `UPDATE animals
       SET adoption_status='Adopted'
       WHERE animal_id=$1`,
      [animal_id]
    );

    // insert adoption
    await client.query(
      `INSERT INTO adoptions (application_id, adoption_fee, payment_status)
       VALUES ($1,3000,'Paid')`,
      [application_id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Adoption approved"
    });

  } catch (err) {
    await client.query("ROLLBACK");

    res.status(500).json({
      message: err.message
    });
  } finally {
    client.release();
  }
};


//  REJECT
const rejectAdoption = async (req, res) => {
  try {
    const { application_id } = req.body;

    await pool.query(
      `UPDATE adoptionapplications
       SET status='Rejected', review_date=NOW()
       WHERE application_id=$1`,
      [application_id]
    );

    res.json({
      success: true,
      message: "Application rejected"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  applyForAdoption,
  getApplications,
  approveAdoption,
  rejectAdoption
};