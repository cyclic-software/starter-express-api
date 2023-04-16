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
    const users = await UserModel.find({ is_del: false, _id: id });
    return users;
  }
  async FindUserByMobile(user_mobile) {
    const users = await UserModel.findOne({ is_del: false, user_mobile:user_mobile });
    return users;
  }
  async UpdateUser(formdata) {
    try{

      const template = await UserModel.updateOne(
        { _id: formdata['id'] },
        { $set: formdata },
      );
      console.log(template)
      const templatedata = await UserModel.find({ _id: formdata['id'] });
      return templatedata;
    }catch(error){
      return error;
    }
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
