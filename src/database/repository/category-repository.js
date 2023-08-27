const mongoose = require('mongoose');
const { CategoryModel,PostModel } = require('../models');

//Dealing with data base operations
class CategoryRepository {
  async CreateCategory(userInputs) {
    const categorys = new CategoryModel(userInputs);

    const categoryresult = await categorys.save();
    return categoryresult;
  }

  async GetCategorys(query) {
    // var query = [
      
    //   {
    //     '$match': {
    //       'post_status': 'Published'
    //     }
    //   },{
    //     '$group': {
    //       '_id': '$category_id'
    //     }
    //   }, {
    //     '$match': {
    //       '_id': {
    //         '$ne': null
    //       }
    //     }
    //   }, {
    //     '$lookup': {
    //       'from': 'categories', 
    //       'localField': '_id', 
    //       'foreignField': '_id', 
    //       'as': 'result'
    //     }
    //   }, {
    //     '$unwind': '$result'
    //   }, {
    //     '$replaceRoot': {
    //       'newRoot': '$result'
    //     }
    //   }
    // ];
    var query = [
      {
            '$match': {
              'is_del': false
            }
          },
    ];
    const templates = await CategoryModel.aggregate(query);
    return templates;
  }
  async GetAdminCategorys(query) {
   
    const templates = await CategoryModel.aggregate(query);
    return templates;
  }
  async FindCategoryById(id) {
    const categorys = await CategoryModel.find({ is_del: false, _id: id });
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
  async SearchCategory(category_name) {
    const category = await CategoryModel.findOne(
      { category_name: category_name },
    );
    return category;
  }
}

module.exports = CategoryRepository;
