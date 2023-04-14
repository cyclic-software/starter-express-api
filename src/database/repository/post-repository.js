const mongoose = require('mongoose');
const { PostModel } = require('../models');

//Dealing with data base operations
class PostRepository {
  async CreatePost(userInputs) {
    const posts = new PostModel(userInputs);

    const postresult = await posts.save();
    return postresult;
  }

  async GetPosts(query) {
    const templates = await PostModel.aggregate(query);
    return templates;
  }
  async FindPostById(id) {
    const posts = await PostModel.find({ is_del: 0, _id: id });
    return posts;
  }
  async UpdatePost(formdata) {
    const template = await PostModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await PostModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeletePost(formdata) {
    const template = await PostModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
}

module.exports = PostRepository;
