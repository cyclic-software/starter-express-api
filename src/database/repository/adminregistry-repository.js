const mongoose = require('mongoose');
const { AdminregistryModel } = require('../models');

//Dealing with data base operations
class AdminregistryRepository {
  async CreateAdminregistry(userInputs) {
    const tags = new AdminregistryModel(userInputs);

    const tagresult = await tags.save();
    return tagresult;
  }

  async GetAdminregistrys(query) {
    const tags = await AdminregistryModel.aggregate(query);
    return tags;
  }
  async GetDataWithEmailAndPassword(email,password) {
    var query = [
      {
        '$match': {
          'adminregistry_email': email, 
          'adminregistry_password': password
        }
      }
    ]
    const tags = await AdminregistryModel.aggregate(query);
    return tags;
  }
  async FindAdminregistryById(id) {
    const tags = await AdminregistryModel.find({ is_del: false, _id: id });
    return tags;
  }
  async UpdateAdminregistry(formdata) {
    const tag = await AdminregistryModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const tagdata = await AdminregistryModel.find({ _id: formdata['id'] });
    return tagdata;
  }
  async DeleteAdminregistry(formdata) {
    const tag = await AdminregistryModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return tag;
  }
  async SearchAdminregistry(tag_name) {
    const tag = await AdminregistryModel.findOne(
      { tag_name: tag_name },
    );
    return tag;
  }
}

module.exports = AdminregistryRepository;
