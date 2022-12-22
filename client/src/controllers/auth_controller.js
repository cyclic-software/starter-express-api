import axios from "axios";

var authBaseUrl = "http://127.0.0.1:3000/api/v1/auth";

export const signIn = async (email, password) => {
  try {
    var request = {
      email,
      password,
    };

    var response = await axios.post(`${authBaseUrl}/sign-in`, request);

    if (response.status === 200 && response.data.errorMessage == null) {
      return { status: "OK", data: response.data };
    }

    return { status: "NOT_OK", errorMessage: response.data.errorMessage };
  } catch (e) {
    console.log(e);
    return { status: "NOT_OK", errorMessage: e.message };
  }
};

export const signUp = async (email, password, firstName, lastName) => {
  try {
    var request = {
      email,
      password,
      firstName,
      lastName,
    };
    var response = await axios.post(`${authBaseUrl}/sign-up`, request);

    if (response.status === 200 && response.data.errorMessage == null) {
      return { status: "OK", data: response.data };
    }

    return { status: "NOT_OK", errorMessage: response.data.errorMessage };
  } catch (e) {
    console.log(e);
    return { status: "NOT_OK", errorMessage: e.message };
  }
};
