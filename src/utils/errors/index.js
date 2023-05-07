
const {
  NotFoundError,
  ValidationError,
  AuthorizeError,
} = require('./app-errors');
const { GetApiResponse } = require('../index');

module.exports = (app) => {
  app.use(async (error, req, res, next) => {
    let reportError = true;

    // skip common / known errors
    [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
      if (error instanceof typeOfError) {
        reportError = false;
      }
    });

    if (reportError) {
      console.log(error)
      // Sentry.captureException(error);
    }
    const statuscode = error.statusCode || 500;
    var data = error.data || error.message;

    data = await GetApiResponse([], data, statuscode);

    return res.status(statuscode).json(data);
  });
};
