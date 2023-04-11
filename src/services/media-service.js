const { MediaRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class MediaService {
  constructor() {
    this.repository = new MediaRepository();
  }

  async AddMedia(userInputs) {
    const MediaResult = await this.repository.CreateMedia(userInputs);
    // console.log(userInputs)
    // MediaResult.full_path =  "http://localhost:8086/uploads/"+userInputs.folder_name+'/'+userInputs.media_file
    return MediaResult;
  }
  async Medias(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const MediaResult = await this.repository.GetMedias(q);
    return MediaResult;
  }
  async MediaById(id) {
    const MediaResult = await this.repository.FindMediaById(id);
    return MediaResult;
  }
  async UpdateMedia(formdata) {
    const MediaResult = await this.repository.UpdateMedia(formdata);
    return MediaResult;
  }
  async DeleteMedia(formdata) {
    const MediaResult = await this.repository.DeleteMedia(formdata);
    var data = this.MediaById(formdata['id']);
    return data;
  }
}

module.exports = MediaService;
