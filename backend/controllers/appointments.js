const pool = require('../models/db');

const updateAppointmentById = (req, res) => {
  const id = req.params.id;
  let { time } = req.body;

  const query = `UPDATE appointments SET time = $1 WHERE id=$2 RETURNING *;`;
  const data = [time, id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `Appointments with id: ${id} updated successfully`,
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
const deleteAppointmentById = (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM appointments WHERE id = $1 RETURNING *;`;
  const data = [id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `Appointments with id: ${id} deleted successfully`,
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

const getAllAppointmentsByUserId = (req, res) => {
  const id = req.params.id;
  const query = `SELECT users.first_name,users.last_name, departments.department_name, appointments.*
  FROM appointments
   INNER JOIN users ON appointments.user_id  =  users.id
   INNER JOIN departments ON appointments.department_id  = departments.id
   WHERE appointments.user_id=($1)`;
  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `all appointments for user${id}`,
        result: result.rows,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'server error',
        error: error.message,
      });
    });
};

const getAllAppointments = (req, res) => {
  pool
    .query(
      `SELECT users.first_name,users.last_name, departments.department_name, appointments.*
  FROM appointments
   INNER JOIN users ON appointments.user_id  =  users.id
   INNER JOIN departments ON appointments.department_id  = departments.id`
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        message: 'all appointments',
        result: result.rows,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'server error',
        error: error.message,
      });
    });
};

const addNewAppointments = async (req, res) => {
  const { user_id, department_id, time, notes } = req.body;
  const query = `
  INSERT 
  INTO 
    appointments 
   (user_id, department_id, time, notes)
  VALUES 
    ($1,$2,$3,$4)
    `;
  const data = [user_id, department_id, time, notes];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: 'Appointment Created Successfully',
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: 'Server Error',
        err,
      });
    });
};

module.exports = {
  updateAppointmentById,
  getAllAppointments,
  addNewAppointments,
  getAllAppointmentsByUserId,
  deleteAppointmentById,
};
