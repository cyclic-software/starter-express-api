const { PostRepository,TagRepository,CategoryRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class PostService {
  constructor() {
    this.repository = new PostRepository();
    this.TagRepository = new TagRepository();
    this.CategoryRepository = new CategoryRepository();
  }
  async SaveMasterTag(post_tags){
    if(post_tags.lenth != 0) {
        post_tags.forEach(async (element) => {
            var posttagdata = await this.TagRepository.SearchTag(element);
            if(posttagdata == null){
                var json = {tag_name:element}
                var posttagdata = await this.TagRepository.CreateTag(json);

            }
        });
    }
    return true;
  }
  async SavePostCategory(postcategroy){
            var postcategorydata = await this.CategoryRepository.SearchCategory(postcategroy);
            
            if(postcategorydata == null){
                var json = {category_name:postcategroy}
                 postcategorydata = await this.CategoryRepository.CreateCategory(json);
                return postcategorydata
            }else{
                return postcategorydata

            }
        
    
  }

  async AddPost(userInputs) {
  
    this.SaveMasterTag(userInputs.post_tags)
var categorydata= await this.SavePostCategory(userInputs.category_name);
userInputs.category_slug = categorydata.category_slug;
    const PostResult = await this.repository.CreatePost(userInputs);
    return PostResult;
  }
  async Posts(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const PostResult = await this.repository.GetPosts(q);
    return PostResult;
  }
  async PostById(id) {
    const PostResult = await this.repository.FindPostById(id);
    return PostResult;
  }
  async UpdatePost(formdata) {
    this.SaveMasterTag(userInputs.post_tags)

    const PostResult = await this.repository.UpdatePost(formdata);
    return PostResult;
  }
  async DeletePost(formdata) {
    const PostResult = await this.repository.DeletePost(formdata);
    var data = this.PostById(formdata['id']);
    return data;
  }
}

module.exports = PostService;
