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
}

module.exports = UserService;
