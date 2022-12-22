import axios from "axios";

var appointmentsBaseUrl = "http://127.0.0.1:3000/api/v1/appointment";

export const getAppointments = async (token) => {
  try {
    var response = await axios.get(appointmentsBaseUrl, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log("get" + JSON.stringify(response));
    if (response.status === 200) {
      return { status: "OK", data: response.data };
    }
    return { status: "NOT_OK", errorMessage: response.errorMessage };
  } catch (e) {
    return { status: "NOT_OK", errorMessage: e.message };
  }
};

export const getAppointmentsByDate = async (token, date) => {
  try {
    var response = await axios.get(`${appointmentsBaseUrl}/${date}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.status === 200) {
      return { status: "OK", data: response.data };
    }
    return { status: "NOT_OK", errorMessage: response.errorMessage };
  } catch (e) {
    return { status: "NOT_OK", errorMessage: e.message };
  }
};

export const insertAppointment = async (token, appointment) => {
  try {
    var response = await axios.post(`${appointmentsBaseUrl}`, appointment, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.status === 200) {
      return { status: "OK", data: response.data };
    }
    return { status: "NOT_OK", errorMessage: response.errorMessage };
  } catch (e) {
    return { status: "NOT_OK", errorMessage: e.message };
  }
};

export const updateAppointment = async (token, appointment) => {
  try {
    console.log("update - " + JSON.stringify(appointment));
    var response = await axios.put(`${appointmentsBaseUrl}`, appointment, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.status === 200) {
      return { status: "OK", data: response.data };
    }
    return { status: "NOT_OK", errorMessage: response.errorMessage };
  } catch (e) {
    return { status: "NOT_OK", errorMessage: e.message };
  }
};

export const deleteAppointment = async (token, appointment) => {
  try {
    console.log(JSON.stringify(appointment));
    var response = await axios.delete(
      `${appointmentsBaseUrl}/${appointment._id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
      appointment
    );

    if (response.status === 200) {
      return { status: "OK", data: response.data };
    }
    return { status: "NOT_OK", errorMessage: response.errorMessage };
  } catch (e) {
    return { status: "NOT_OK", errorMessage: e.message };
  }
};
