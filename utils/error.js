const customError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

export default customError;
