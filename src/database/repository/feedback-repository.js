const mongoose = require('mongoose');
const { FeedbackModel } = require('../models');

//Dealing with data base operations
class FeedbackRepository {
  async CreateFeedback(userInputs) {
    const tags = new FeedbackModel(userInputs);

    const tagresult = await tags.save();
    return tagresult;
  }

  async GetFeedbacks(query) {
    const tags = await FeedbackModel.aggregate(query);
    return tags;
  }
  async FindFeedbackById(id) {
    const tags = await FeedbackModel.find({ is_del: false, _id: id });
    return tags;
  }
  async UpdateFeedback(formdata) {
    const tag = await FeedbackModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const tagdata = await FeedbackModel.find({ _id: formdata['id'] });
    return tagdata;
  }
  async DeleteFeedback(formdata) {
    const tag = await FeedbackModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return tag;
  }
  async SearchFeedback(tag_name) {
    const tag = await FeedbackModel.findOne(
      { tag_name: tag_name },
    );
    return tag;
  }
}

module.exports = FeedbackRepository;
