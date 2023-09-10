const mongoose = require('mongoose');
const { NotificationModel } = require('../models');

//Dealing with data base operations
class NotificationRepository {
  async CreateNotification(userInputs) {
    const tags = new NotificationModel(userInputs);

    const tagresult = await tags.save();
    return tagresult;
  }

  async GetNotifications(query) {
    const tags = await NotificationModel.aggregate(query);
    return tags;
  }
  async FindNotificationById(id) {
    const tags = await NotificationModel.find({ is_del: false, _id: id });
    return tags;
  }
  async UpdateNotification(formdata) {
    const tag = await NotificationModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const tagdata = await NotificationModel.find({ _id: formdata['id'] });
    return tagdata;
  }
  async DeleteNotification(formdata) {
    const tag = await NotificationModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return tag;
  }
  async SearchNotification(tag_name) {
    const tag = await NotificationModel.findOne(
      { tag_name: tag_name },
    );
    return tag;
  }
}

module.exports = NotificationRepository;
