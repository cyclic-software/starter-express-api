const { UserRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async AddUser(userInputs) {
    console.log(userInputs)
    const UserResult = await this.repository.CreateUser(userInputs);
    return UserResult;
  }
  async Users(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const UserResult = await this.repository.GetUsers(q);
    return UserResult;
  }
  async UserById(id) {
    const UserResult = await this.repository.FindUserById(id);
    return UserResult;
  }
  async UpdateUser(formdata) {
    const UserResult = await this.repository.UpdateUser(formdata);
    return UserResult;
  }
  async DeleteUser(formdata) {
    const UserResult = await this.repository.DeleteUser(formdata);
    var data = this.UserById(formdata['id']);
    return data;
  }
  async CheckUserIfnotThenInsert(userInputs) {
    const userdata = await this.repository.FindUserByMobile(userInputs.user_mobile);
    if(userdata == null){

      const UserResult = await this.repository.CreateUser(userInputs);
      return UserResult;
    }else{
      userInputs.id = userdata._id;
      const UserResult = await this.repository.UpdateUser(userInputs);
      return userdata;
    }
  }
}

module.exports = UserService;
