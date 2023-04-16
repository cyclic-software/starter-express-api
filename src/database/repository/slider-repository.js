const mongoose = require('mongoose');
const { SliderModel } = require('../models');

//Dealing with data base operations
class SliderRepository {
  async CreateSlider(userInputs) {
    const sliders = new SliderModel(userInputs);

    const sliderresult = await sliders.save();
    return sliderresult;
  }

  async GetSliders(query) {
    const templates = await SliderModel.aggregate(query);
    return templates;
  }
  async FindSliderById(id) {
    const sliders = await SliderModel.find({ is_del: false, _id: id });
    return sliders;
  }
  async UpdateSlider(formdata) {
    const template = await SliderModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await SliderModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeleteSlider(formdata) {
    const template = await SliderModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
}

module.exports = SliderRepository;
