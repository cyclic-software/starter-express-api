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
    const templates = await TagModel.aggregate(query);
    return templates;
  }
  async FindTagById(id) {
    const tags = await TagModel.find({ is_del: 0, _id: id });
    return tags;
  }
  async UpdateTag(formdata) {
    const template = await TagModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await TagModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeleteTag(formdata) {
    const template = await TagModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
}

module.exports = TagRepository;
