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
  async GetUserFcmtoken(useridlist) {
    useridlist = useridlist.map(useridlist => mongoose.Types.ObjectId(useridlist)); // get only 'name' field
    const userdata = await UserModel.find({  _id: { $in: useridlist }}).select("user_fcm_token");
    const user_fcm_token_list = userdata.map(doc => doc.user_fcm_token); // get only 'name' field
    return user_fcm_token_list;
  }
  async GetAllFcmToken() {
    const userdata = await UserModel.find({is_del: false}).select("user_fcm_token");
    const user_fcm_token_list = userdata.map(doc => doc.user_fcm_token); // get only 'name' field
    return user_fcm_token_list;
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
