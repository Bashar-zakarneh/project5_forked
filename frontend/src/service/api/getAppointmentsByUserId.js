import axios from 'axios';

export const getAppointmentsByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/appointments/${userId}`
    );
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
