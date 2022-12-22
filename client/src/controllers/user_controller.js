import axios from "axios";

var userBaseUrl = "http://127.0.0.1:3000/api/v1/user";

export const getUserInfo = async (token) => {
  try {
    var response = await axios.get(userBaseUrl, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 200 && response.data.errorMessage == null) {
      return { status: "OK", data: response.data };
    }

    return { status: "NOT_OK", errorMessage: response.data.errorMessage };
  } catch (e) {
    console.log(e);
    return { status: "NOT_OK", errorMessage: e.message };
  }
};
