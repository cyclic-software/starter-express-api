const AdminregistryService = require("../services/adminregistry-service");
const {
  SubscribeMessage,
  GetApiResponse,
  GetPagination,
  GetSortByFromRequest,
} = require("../utils");

const { Validator } = require("node-input-validator");

module.exports = (app) => {
  const service = new AdminregistryService();
  // To listen
  // SubscribeMessage(channel, service);
  app.post("/adminregistry/create",  async (req, res, next) => {
    try {
      const v = new Validator(req.body, {
        adminregistry_name: "required",
      });
      const matched = await v.check();
      if (!matched) {
        return res.status(400).send(v.errors);
      }
      var data = await service.AddAdminregistry(req.body);
      data = data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/adminregistrylogin",  async (req, res, next) => {
    try {
      const v = new Validator(req.body, {
        adminregistry_email: "required",
        adminregistry_password: "required",
      });
      const matched = await v.check();
      if (!matched) {
        return res.status(400).send(v.errors);
      }
      var data = await service.GetRegistryData(req.body.adminregistry_email,req.body.adminregistry_password);
      data = data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/adminregistrys",  async (req, res, next) => {
    try {
      const { limit, skip } = await GetPagination(req.body.page, req.body.size);
      var sortarray = await GetSortByFromRequest(
        req.body.orderbycolumnname,
        req.body.orderby
      );
      var data = await service.Adminregistrys(limit, skip, req.body, sortarray);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.post("/adminregistry/:id",  async (req, res, next) => {
    try {
      var data = await service.adminregistryById(req.params.id);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.put("/adminregistry/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.UpdateAdminregistry(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.delete("/adminregistry/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.DeleteAdminregistry(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};
