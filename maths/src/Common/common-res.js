module.exports = {
  sendRes: (res, data, successMsg, status = 200, token = null) => {
    let result = {
      status,
      isSuccess: true,
      data,
      successMsg,
      isError: false,
      errorMsg: null,
    };
    if (token) {
      result.token = token;
    }
    return res.status(status).json(result);
  },
  sendErrorResp: (res, status = 400, errorMsg = "") => {
    let result = {
      status,
      isSuccess: false,
      data: null,
      isError: true,
      errorMsg: errorMsg,
    };
    return res.status(status).json(result);
  },
  send500: (res) => {
    let result = {
      status: 500,
      isSuccess: false,
      data: null,
      isError: true,
      errorMsg: "Some error occured",
    };
    return res.status(500).json(result);
  },
};
