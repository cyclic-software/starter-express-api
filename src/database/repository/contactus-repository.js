const mongoose = require('mongoose');
const { ContactusModel } = require('../models');

//Dealing with data base operations
class ContactusRepository {
  async CreateContactus(userInputs) {
    const contactuss = new ContactusModel(userInputs);

    const contactusresult = await contactuss.save();
    return contactusresult;
  }

  async GetContactuss(query) {
    const contactuss = await ContactusModel.aggregate(query);
    return contactuss;
  }
  async FindContactusById(id) {
    const contactuss = await ContactusModel.find({ is_del: false, _id: id });
    return contactuss;
  }
  async UpdateContactus(formdata) {
    const contactus = await ContactusModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const contactusdata = await ContactusModel.find({ _id: formdata['id'] });
    return contactusdata;
  }
  async DeleteContactus(formdata) {
    const contactus = await ContactusModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return contactus;
  }
  async SearchContactus(contactus_name) {
    const contactus = await ContactusModel.findOne(
      { contactus_name: contactus_name },
    );
    return contactus;
  }
}

module.exports = ContactusRepository;
