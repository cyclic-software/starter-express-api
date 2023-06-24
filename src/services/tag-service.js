const { TagRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class TagService {
  constructor() {
    this.repository = new TagRepository();
  }

  async AddTag(userInputs) {
    const TagResult = await this.repository.CreateTag(userInputs);
    return TagResult;
  }
  async Tags(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    console.log(JSON.stringify(q))
    const TagResult = await this.repository.GetTags(q);
    return TagResult;
  }
  async TagById(id) {
    const TagResult = await this.repository.FindTagById(id);
    return TagResult;
  }
  async UpdateTag(formdata) {
    const TagResult = await this.repository.UpdateTag(formdata);
    return TagResult;
  }
  async DeleteTag(formdata) {
    const TagResult = await this.repository.DeleteTag(formdata);
    var data = this.TagById(formdata['id']);
    return data;
  }
}

module.exports = TagService;
