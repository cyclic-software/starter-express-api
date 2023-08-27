const { ContactusRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class ContactusService {
  constructor() {
    this.repository = new ContactusRepository();
  }

  async AddContactus(userInputs) {
    const ContactusResult = await this.repository.CreateContactus(userInputs);
    return ContactusResult;
  }
  async Contactuss(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const ContactusResult = await this.repository.GetContactuss(q);
    return ContactusResult;
  }
  async ContactusById(id) {
    const ContactusResult = await this.repository.FindContactusById(id);
    return ContactusResult;
  }
  async UpdateContactus(formdata) {
    const ContactusResult = await this.repository.UpdateContactus(formdata);
    return ContactusResult;
  }
  async DeleteContactus(formdata) {
    const ContactusResult = await this.repository.DeleteContactus(formdata);
    var data = this.ContactusById(formdata['id']);
    return data;
  }
}

module.exports = ContactusService;
