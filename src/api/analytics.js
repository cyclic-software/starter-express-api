const AnalyticsService = require("../services/analytics-service");
const {
  SubscribeMessage,
  GetApiResponse,
  GetPagination,
  GetSortByFromRequest,
} = require("../utils");

const { Validator } = require("node-input-validator");

module.exports = (app) => {
  const service = new AnalyticsService();
  // To listen
  // SubscribeMessage(channel, service);
  app.post("/analytics/post/create",  async (req, res, next) => {
    try {
      const v = new Validator(req.body, {
        post: "required",
        user: "required",
        anallytics_type: "required",
      });
      const matched = await v.check();
      if (!matched) {
        return res.status(400).send(v.errors);
      }
      req.body.user_id  = req.body.user
      req.body.post_id  = req.body.post
      var data = await service.AddAnalytics(req.body);
      data = data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/analyticss",  async (req, res, next) => {
    try {
      const { limit, skip } = await GetPagination(req.body.page, req.body.size);
      var sortarray = await GetSortByFromRequest(
        req.body.orderbycolumnname,
        req.body.orderby
      );
      var data = await service.Analyticss(limit, skip, req.body, sortarray);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  
  app.post("/adminanalyticss",  async (req, res, next) => {
    try {
     
      var data = await service.AdminAnalyticss();
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.post("/analytics/:id",  async (req, res, next) => {
    try {
      var data = await service.analyticsById(req.params.id);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.put("/analytics/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.UpdateAnalytics(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.delete("/analytics/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.DeleteAnalytics(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  
};
