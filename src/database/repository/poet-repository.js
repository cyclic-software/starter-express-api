const mongoose = require('mongoose');
const { PoetModel } = require('../models');

//Dealing with data base operations
class PoetRepository {
  async CreatePoet(userInputs) {
    const poets = new PoetModel(userInputs);

    const poetresult = await poets.save();
    return poetresult;
  }

  async GetPoets(query) {
    const templates = await PoetModel.aggregate(query);
    return templates;
  }
  async FindPoetById(id) {
    const poets = await PoetModel.find({ is_del: false, _id: id });
    return poets;
  }
  async UpdatePoet(formdata) {
    const template = await PoetModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await PoetModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeletePoet(formdata) {
    const template = await PoetModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
  async SearchPoet(poet_name) {
    const poet = await PoetModel.findOne(
      { poet_name: poet_name },
    );
    return poet;
  }
}

module.exports = PoetRepository;
