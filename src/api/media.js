const MediaService = require("../services/media-service");
const {
  SubscribeMessage,
  GetApiResponse,
  GetPagination,
  GetSortByFromRequest,
  GetUploadFullPath
} = require("../utils");
const upload = require("./middlewares/upload");

const singleUpload = upload.single("image");

const { Validator } = require("node-input-validator");

module.exports = (app) => {
  const service = new MediaService();
  // To listen
  // SubscribeMessage(channel, service);


  app.post("/media/create", async (req, res, next) => {
    try {


      singleUpload(req, res, function (err) {
        if (err) {
          res.json({
            success: false,
            errors: {
              title: "Image Upload Error",
              detail: err.message,
              error: err,
            },
          });
        }
      });
    
        // let update = { profilePicture: req.file.location };
        // console.log(update)
         res.json(req.file);
    
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
