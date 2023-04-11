const mongoose = require('mongoose');
const { CategoryModel } = require('../models');

//Dealing with data base operations
class CategoryRepository {
  async CreateCategory(userInputs) {
    const categorys = new CategoryModel(userInputs);

    const categoryresult = await categorys.save();
    return categoryresult;
  }

  async GetCategorys(query) {
    const templates = await CategoryModel.aggregate(query);
    return templates;
  }
  async FindCategoryById(id) {
    const categorys = await CategoryModel.find({ is_del: 0, _id: id });
    return categorys;
  }
  async UpdateCategory(formdata) {
    const template = await CategoryModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await CategoryModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeleteCategory(formdata) {
    const template = await CategoryModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
}

module.exports = CategoryRepository;
