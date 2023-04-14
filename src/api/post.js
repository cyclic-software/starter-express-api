const PostService = require("../services/post-service");
const {
  SubscribeMessage,
  GetApiResponse,
  GetPagination,
  GetSortByFromRequest,
} = require("../utils");

const { Validator } = require("node-input-validator");

module.exports = (app) => {
  const service = new PostService();
  // To listen
  // SubscribeMessage(channel, service);
  app.post("/post/create",  async (req, res, next) => {
    try {
      const v = new Validator(req.body, {
        post_name: "required",
      });
      const matched = await v.check();
      if (!matched) {
        return res.status(400).send(v.errors);
      }
      var data = await service.AddPost(req.body);
      data = data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/posts",  async (req, res, next) => {
    try {
      const { limit, skip } = await GetPagination(req.body.page, req.body.size);
      var sortarray = await GetSortByFromRequest(
        req.body.orderbycolumnname,
        req.body.orderby
      );
      var data = await service.Posts(limit, skip, req.body, sortarray);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.post("/post/:id",  async (req, res, next) => {
    try {
      var data = await service.postById(req.params.id);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.put("/post/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.UpdatePost(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.delete("/post/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.DeletePost(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};
