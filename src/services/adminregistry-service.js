const { AdminregistryRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class AdminregistryService {
  constructor() {
    this.repository = new AdminregistryRepository();
  }

  async AddAdminregistry(userInputs) {
    const AdminregistryResult = await this.repository.CreateAdminregistry(userInputs);
    return AdminregistryResult;
  }
  async Adminregistrys(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const AdminregistryResult = await this.repository.GetAdminregistrys(q);
    return AdminregistryResult;
  }
  async GetRegistryData(email,password) {
 const AdminregistryResult = await this.repository.GetDataWithEmailAndPassword(email,password);
    return AdminregistryResult;
  }
  async AdminregistryById(id) {
    const AdminregistryResult = await this.repository.FindAdminregistryById(id);
    return AdminregistryResult;
  }
  async UpdateAdminregistry(formdata) {
    
    const AdminregistryResult = await this.repository.UpdateAdminregistry(formdata);
    return AdminregistryResult;
  }
  async DeleteAdminregistry(formdata) {
    const AdminregistryResult = await this.repository.DeleteAdminregistry(formdata);
    var data = this.AdminregistryById(formdata['id']);
    return data;
  }
}

module.exports = AdminregistryService;
