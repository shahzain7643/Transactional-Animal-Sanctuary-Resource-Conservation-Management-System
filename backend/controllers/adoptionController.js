const pool = require("../db/database");

const approveAdoption = async (req, res) => {

  const client = await pool.connect();

  try {

    const { application_id, admin_id, adoption_fee } = req.body;

    await client.query("BEGIN");

    
    const application = await client.query(
      `SELECT animal_id FROM adoptionapplications
       WHERE application_id = $1`,
      [application_id]
    );

    if (application.rows.length === 0) {
      throw new Error("Application not found");
    }

    const animal_id = application.rows[0].animal_id;

    
    await client.query(
      `UPDATE adoptionapplications
       SET status='Approved',
           admin_id=$1,
           review_date=NOW()
       WHERE application_id=$2`,
      [admin_id, application_id]
    );

    
    await client.query(
      `UPDATE animals
       SET adoption_status='Adopted'
       WHERE animal_id=$1`,
      [animal_id]
    );

    
    await client.query(
      `INSERT INTO adoptions
       (application_id, adoption_fee, payment_status)
       VALUES ($1,$2,'Paid')`,
      [application_id, adoption_fee]
    );

   await client.query(
    `INSERT INTO financialledger 
    (transaction_type, reference_id, amount, description) 
    VALUES ($1, $2, $3, $4)`,
    ["AdoptionFee", application_id, 3000, "Adoption payment"]
    );

    await client.query("COMMIT");

    res.json({
      success:true,
      message:"Adoption approved successfully"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    res.status(500).json({
      success:false,
      message:error.message
    });

  } finally {

    client.release();

  }

};

module.exports = { approveAdoption };