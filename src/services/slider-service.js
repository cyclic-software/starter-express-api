const { SliderRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class SliderService {
  constructor() {
    this.repository = new SliderRepository();
  }

  async AddSlider(userInputs) {
    const SliderResult = await this.repository.CreateSlider(userInputs);
    return SliderResult;
  }
  async Sliders(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const SliderResult = await this.repository.GetSliders(q);
    return SliderResult;
  }
  async SliderById(id) {
    const SliderResult = await this.repository.FindSliderById(id);
    return SliderResult;
  }
  async UpdateSlider(formdata) {
    const SliderResult = await this.repository.UpdateSlider(formdata);
    return SliderResult;
  }
  async DeleteSlider(formdata) {
    const SliderResult = await this.repository.DeleteSlider(formdata);
    var data = this.SliderById(formdata['id']);
    return data;
  }
}

module.exports = SliderService;
