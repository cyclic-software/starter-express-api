const { PoetRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class PoetService {
  constructor() {
    this.repository = new PoetRepository();
  }

  async AddPoet(userInputs) {
    const PoetResult = await this.repository.CreatePoet(userInputs);
    return PoetResult;
  }
  async Poets(size, skip, matchdata, sortob) {
    var sortob = {
      orderbycolumnname:"like",
      orderby:-1
    }
    var q = await paginateResults(size, skip, matchdata, sortob);
    console.log(q)
    const PoetResult = await this.repository.GetPoets(q);
    return PoetResult;
  }
  async AdminPoets(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const PoetResult = await this.repository.GetAdminPoets(q);
    return PoetResult;
  }
  async PoetById(id) {
    const PoetResult = await this.repository.FindPoetById(id);
    return PoetResult;
  }
  async UpdatePoet(formdata) {
    const PoetResult = await this.repository.UpdatePoet(formdata);
    return PoetResult;
  }
  async DeletePoet(formdata) {
    const PoetResult = await this.repository.DeletePoet(formdata);
    var data = this.PoetById(formdata['id']);
    return data;
  }
}

module.exports = PoetService;
