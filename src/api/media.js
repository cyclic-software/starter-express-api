const MediaService = require("../services/media-service");
const {
  SubscribeMessage,
  GetApiResponse,
  GetPagination,
  GetSortByFromRequest,
  GetUploadFullPath
} = require("../utils");
const uploadFile = require("./middlewares/upload");

const { Validator } = require("node-input-validator");

module.exports = (app) => {
  const service = new MediaService();
  // To listen
  // SubscribeMessage(channel, service);


  app.post("/media/create", async (req, res, next) => {
    try {
      const v = new Validator(req.body, {
        file: "required",
      });
      const matched = await v.check();
      if (!matched) {
        return res.status(400).send(v.errors);
      }
      var uploadfile = await uploadFile(req, res);
      
      req.body.media_file = req.media_file;
      req.body.full_path = GetUploadFullPath(req.body.folder_name,req.body.media_file);
      var data = await service.AddMedia(req.body);

      data =  await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/medias",  async (req, res, next) => {
    try {
      const { limit, skip } = await GetPagination(req.body.page, req.body.size);
      var sortarray = await GetSortByFromRequest(
        req.body.orderbycolumnname,
        req.body.orderby
      );
      var data = await service.Medias(limit, skip, req.body, sortarray);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.post("/media/:id",  async (req, res, next) => {
    try {
      var data = await service.mediaById(req.params.id);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.put("/media/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var uploadfile = await uploadFile(req, res);
      
      req.body.media_file = req.media_file;
      req.body.full_path = GetUploadFullPath(req.body.folder_name,req.body.media_file);
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.UpdateMedia(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.delete("/media/:id",  async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.DeleteMedia(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};
