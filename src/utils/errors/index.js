const Sentry = require('@sentry/node');
const _ = require('@sentry/tracing');
const {
  NotFoundError,
  ValidationError,
  AuthorizeError,
} = require('./app-errors');
const { GetApiResponse } = require('../index');
Sentry.init({
  dsn: 'https://64dd5e8d92f248ba93fff175fe0eba4e@o4504518491373568.ingest.sentry.io/4504518493667328',
  tracesSampleRate: 1.0,
});

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
      Sentry.captureException(error);
    }
    const statuscode = error.statusCode || 500;
    var data = error.data || error.message;

    data = await GetApiResponse([], data, statuscode);

    return res.status(statuscode).json(data);
  });
};
