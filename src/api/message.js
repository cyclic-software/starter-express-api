const MessageService = require("../services/message-service");
const {
  SubscribeMessage,
  GetApiResponse,
  GetPagination,
  GetSortByFromRequest,
} = require("../utils");
const {
  WABA_SENT_STATUS,
  WABA_READ_STATUS,
  WABA_DELIVERED_STATUS,
} = require("../config");

const { Validator } = require("node-input-validator");
const UserAuth = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new MessageService();
  // To listen
  // SubscribeMessage(channel, service);
  app.post("/message/create", async (req, res, next) => {
    try {
      const v = new Validator(req.body, {
        to: "required",
        type: "required",
      });
      const matched = await v.check();
      if (!matched) {
        return res.status(400).send(v.errors);
      }
      var requiredtypearray = [
        "text",
        "template",
        "interactive",
        "contacts",
        "location",
        "audio",
        "video",
        "image",
        "document",
        "sticker",
      ];
      if (requiredtypearray.indexOf(req.body.type) === -1) {
        data = await GetApiResponse(
          [],
          "Enum Data type error Type must be In this " + requiredtypearray,
          400
        );
        return res.status(400).send(data);
      }

      var formdata = req.body;
      var islast24available = await service.CheckUserSessionActivity(
        req.body.to
      );

      if (islast24available || req.body.type == "template") {
        var { status, messageresult } = await service.AddMessage(formdata);

        data = await GetApiResponse(messageresult, "", status);
        return res.json(data);
      } else {
        data = [];
        message =
          "User Session Is Inactive For Last 24 hours You Can Only send Template message";
        statuscode = "400";
        data = await GetApiResponse(data, message, statuscode);
        return res.json(data);
      }
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/webhook", async (req, res, next) => {
    try {
      const body = req.body.body;
      if (body) {
        const { object, entry } = body;
        if (object !== "whatsapp_business_account") {
          return res.status(201).json(object);
        }

        for (let object of entry) {
          const { id: objectID, changes } = object;
          for (let change of changes) {
            if (change.value.contacts != undefined) {
              var data = await service.OnSaveWebhook(change);
            } else {
              var message_id = change.value.statuses[0].id;
              var status = change.value.statuses[0].status;
              var formdata = {
                message_id: message_id,
                status: status,
              };
              if (status == WABA_SENT_STATUS) {
                formdata["sent"] = change.value.statuses[0];
              }
              if (status == WABA_READ_STATUS) {
                formdata["read"] = change.value.statuses[0];
              }
              if (status == WABA_DELIVERED_STATUS) {
                formdata["delivered"] = change.value.statuses[0];
              }
              var data = await service.UpdateStatus(formdata);
            }
          }
        }
      }
      // const wholeresponse = req.body;

      // if (body) {
      //   const { object, entry } = body;
      //   if (object !== 'whatsapp_business_account') {
      //     return res.status(201).json(object);
      //   }
      //   for (let object of entry) {
      //     const { id: objectID, changes } = object;
      //     var array = [];
      //     for (let change of changes) {
      //       const { value, field } = change;
      //       const {
      //         messaging_product,
      //         metadata,
      //         contacts,
      //         messages,
      //         statuses,
      //       } = value;
      //       const { display_phone_number, phone_number_id } = metadata;

      //       if (field === 'messages') {
      //         if (messages) {
      //           for (let message of messages) {
      //             const { from, id, messageID, timestamp, type } = message;

      //             if (type === 'text') {
      //               await service.WhatsappWebhookSaveData(
      //                 message,
      //                 wholeresponse,
      //               );
      //             }
      //           }
      //         }
      //       }
      //       array.push(changes);
      //     }
      //   }
      //   return res.status(200).json({ data: 'Webhook Triggered Successfully' });
      // }
      return res.json(body);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  app.post("/message", async (req, res, next) => {
    try {
      const { limit, skip } = await GetPagination(req.body.page, req.body.size);

      var sortarray = await GetSortByFromRequest(
        req.body.orderbycolumnname,
        req.body.orderby
      );

      var data = await service.Messages(limit, skip, req.body, sortarray);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.put("/message/:id", UserAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.UpdateMessage(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
  app.delete("/message/:id", UserAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      var formdata = req.body;
      formdata["id"] = id;
      var data = await service.DeleteMessage(formdata);
      data = await GetApiResponse(data);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};
