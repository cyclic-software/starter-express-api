const mongoose = require('mongoose');
const { TagModel } = require('../models');

//Dealing with data base operations
class TagRepository {
  async CreateTag(userInputs) {
    const tags = new TagModel(userInputs);

    const tagresult = await tags.save();
    return tagresult;
  }

  async GetTags(query) {
    const tags = await TagModel.aggregate(query);
    return tags;
  }
  async FindTagById(id) {
    const tags = await TagModel.find({ is_del: false, _id: id });
    return tags;
  }
  async UpdateTag(formdata) {
    const tag = await TagModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const tagdata = await TagModel.find({ _id: formdata['id'] });
    return tagdata;
  }
  async DeleteTag(formdata) {
    const tag = await TagModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return tag;
  }
  async SearchTag(tag_name) {
    const tag = await TagModel.findOne(
      { tag_name: tag_name },
    );
    return tag;
  }
}

module.exports = TagRepository;
