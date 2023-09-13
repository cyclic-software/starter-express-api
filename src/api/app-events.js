const SmsService = require('../services/sms-service');

module.exports = (app) => {
  const service = new SmsService();
  app.use('/app-events', async (req, res, next) => {
    const { payload } = req.body;

    //handle subscribe events
    service.SubscribeEvents(payload);

    console.log('============= Sms ================');
    res.json(payload);
  });
};
