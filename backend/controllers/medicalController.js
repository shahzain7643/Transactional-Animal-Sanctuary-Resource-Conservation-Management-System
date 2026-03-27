const pool = require("../db/database");

const treatAnimal = async (req, res) => {

  const client = await pool.connect();

  try {

    const { animal_id, medicine_id, quantity_used, staff_id, treatment_description } = req.body;

    await client.query("BEGIN");

    
    const medicineCheck = await client.query(
      "SELECT quantity_in_stock FROM medicines WHERE medicine_id=$1",
      [medicine_id]
    );

    if (medicineCheck.rows.length === 0) {
      throw new Error("Medicine not found");
    }

    const stock = medicineCheck.rows[0].quantity_in_stock;

    if (stock < quantity_used) {
      throw new Error("Not enough medicine stock");
    }

    await client.query(
    `INSERT INTO medicalrecords
    (animal_id, staff_id, medicine_id, quantity_used, treatment_date, treatment_description)
    VALUES ($1,$2,$3,$4,NOW(),$5)`,
    [animal_id, staff_id, medicine_id, quantity_used, treatment_description]
    );

    
    await client.query(
      `UPDATE medicines
       SET quantity_in_stock = quantity_in_stock - $1
       WHERE medicine_id = $2`,
      [quantity_used, medicine_id]
    );

    
    await client.query(
      `INSERT INTO inventorytransactions (medicine_id, transaction_type, quantity, transaction_date)
       VALUES ($1,'OUT',$2,NOW())`,
      [medicine_id, quantity_used]
    );

    await client.query("COMMIT");

    res.json({
      success:true,
      message:"Treatment recorded successfully"
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

module.exports = { treatAnimal };