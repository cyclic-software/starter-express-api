const mongoose = require('mongoose');
const { UserModel } = require('../models');

//Dealing with data base operations
class UserRepository {
  async CreateUser(userInputs) {
    const users = new UserModel(userInputs);

    const userresult = await users.save();
    return userresult;
  }

  async GetUsers(query) {
    const templates = await UserModel.aggregate(query);
    return templates;
  }
  async FindUserById(id) {
    const users = await UserModel.find({ is_del: 0, _id: id });
    return users;
  }
  async UpdateUser(formdata) {
    const template = await UserModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await UserModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeleteUser(formdata) {
    const template = await UserModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
}

module.exports = UserRepository;
