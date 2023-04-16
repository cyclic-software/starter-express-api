const mongoose = require('mongoose');
const { MediaModel } = require('../models');

//Dealing with data base operations
class MediaRepository {
  async CreateMedia(userInputs) {
    const medias = new MediaModel(userInputs);

    const mediaresult = await medias.save();
    return mediaresult;
  }

  async GetMedias(query) {
    const templates = await MediaModel.aggregate(query);
    return templates;
  }
  async FindMediaById(id) {
    const medias = await MediaModel.find({ is_del: false, _id: id });
    return medias;
  }
  async UpdateMedia(formdata) {
    
    const template = await MediaModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await MediaModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeleteMedia(formdata) {
    const template = await MediaModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
}

module.exports = MediaRepository;
