const { CategoryRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  async AddCategory(userInputs) {
    const CategoryResult = await this.repository.CreateCategory(userInputs);
    return CategoryResult;
  }
  async Categorys(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const CategoryResult = await this.repository.GetCategorys(q);
    return CategoryResult;
  }
  async AdminCategorys(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const CategoryResult = await this.repository.GetAdminCategorys(q);
    return CategoryResult;
  }
  async CategoryById(id) {
    const CategoryResult = await this.repository.FindCategoryById(id);
    return CategoryResult;
  }
  async UpdateCategory(formdata) {
    const CategoryResult = await this.repository.UpdateCategory(formdata);
    return CategoryResult;
  }
  async DeleteCategory(formdata) {
    const CategoryResult = await this.repository.DeleteCategory(formdata);
    var data = this.CategoryById(formdata['id']);
    return data;
  }
}

module.exports = CategoryService;
