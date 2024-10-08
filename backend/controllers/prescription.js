const pool = require('../models/db');

const getAllPrescription = (req, res) => {
  const id = req.params.id;
  const query = `SELECT doctors.doctor_name, pharmacy.pharmacist_name, prescription.* 
FROM prescription
INNER JOIN doctors ON doctors.id = prescription.doctor_id
INNER JOIN pharmacy ON pharmacy.id = prescription.pharmacist_id
WHERE prescription.user_id = ($1);`;
  const data = [id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: 'All the prescription',
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error',
        err: err,
      });
    });
};

const getPrescriptionByNationalId = (req, res) => {
  const id = req.params.patientid;
  const query = `SELECT users.first_name,users.last_name,patientid,prescription.* 
  FROM prescription
  INNER JOIN users ON users.id=prescription.user_id WHERE users.patientid=($1)`;
  const data = [id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `The reports with patientid: ${id}`,
          result: result.rows,
        });
      } else {
        throw new Error('Error happened while getting reports');
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error',
        err: err.message,
      });
    });
};

const SendPrescriptionRequest = (req, res) => {
  const { doctor_id, user_id, pharmacist_id, title, description, quantity } =
    req.body;

  const query = `INSERT INTO prescription
   (doctor_id, user_id, pharmacist_id, title, description, quantity)
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`;

  const data = [
    doctor_id,
    user_id,
    pharmacist_id,
    title,
    description,
    quantity,
  ];

  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: 'Prescription created successfully',
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error',
        err: err.message,
      });
    });
};

const updatePrescriptionStatus = (req, res) => {
  const id = req.params.id;
  let { status } = req.body;

  const query = `UPDATE prescription SET status = $1 WHERE id=$2 RETURNING *;`;
  const data = [status, id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `prescription Status with id: ${id} updated successfully`,
          result: result.rows[0],
        });
      } else {
        throw new Error('Error happened while updating article');
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error',
        err: err,
      });
    });
};

module.exports = {
  getAllPrescription,
  SendPrescriptionRequest,
  updatePrescriptionStatus,
  getPrescriptionByNationalId,
};
