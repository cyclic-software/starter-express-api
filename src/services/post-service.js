const { user } = require('firebase-functions/v1/auth');
const { PostRepository, TagRepository, CategoryRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class PostService {
  constructor() {
    this.repository = new PostRepository();
    this.TagRepository = new TagRepository();
    this.CategoryRepository = new CategoryRepository();
  }
  async SaveMasterTag(post_tags) {
    if (post_tags.lenth != 0) {
      post_tags.forEach(async (element) => {
        var posttagdata = await this.TagRepository.SearchTag(element);
        if (posttagdata == null) {
          var json = { tag_name: element }
          var posttagdata = await this.TagRepository.CreateTag(json);

        }
      });
    }
    return true;
  }
  async SavePostCategory(postcategroy) {
    var postcategorydata = await this.CategoryRepository.SearchCategory(postcategroy);

    if (postcategorydata == null) {
      var json = { category_name: postcategroy }
      postcategorydata = await this.CategoryRepository.CreateCategory(json);
      return postcategorydata
    } else {
      return postcategorydata

    }


  }

  async AddPost(userInputs) {

    this.SaveMasterTag(userInputs.post_tags)
    var categorydata = await this.SavePostCategory(userInputs.category_name);
    userInputs.category_slug = categorydata.category_slug;
    const PostResult = await this.repository.CreatePost(userInputs);
    return PostResult;
  }
  async AddPostLike(userInputs) {
    var checkexist = await this.CheckPostIsLikedOrNOt(userInputs.user,userInputs.post)
    if(checkexist == null){

      const PostResult = await this.repository.PostLikeAdd(userInputs);
      return PostResult;
    }else{
      return checkexist;
    }
  }
  async GetAllPostLikes(userInputs) {

    const PostResult = await this.repository.GetPostWithLikes(userInputs);
    return PostResult;
  }
  async CheckPostIsLikedOrNOt(user,post) {

    const PostResult = await this.repository.GetLikePostByUserId(user,post);
    return PostResult;
  }
  async CheckPostIsWishlistOrNOt(user,post) {

    const PostResult = await this.repository.GetWishlistostByUserId(user,post);
    return PostResult;
  }
  async AddPostWishlist(userInputs) {
    var checkexist = await this.CheckPostIsWishlistOrNOt(userInputs.user,userInputs.post)
    if(checkexist == null){
      const PostResult = await this.repository.PostWishlistAdd(userInputs);
      return PostResult;
    }else{
      return checkexist;

    }
  }
  async GetAllPostWishlist(userInputs) {

    const PostResult = await this.repository.GetPostWithWishlists(userInputs);
    return PostResult;
  }

  
  async AdminPosts(size, skip, matchdata, sortob) {
    try{

      var q = await paginateResults(size, skip, matchdata, sortob);
      var PostResult   = await this.repository.GetPosts(q);

      
      return PostResult;
    }catch(error){
      console.log(error)
      return error
    }
  }
  async Posts(size, skip, matchdata, sortob) {
    try{

      matchdata["post_status"] = "Published";
      var q = await paginateResults(size, skip, matchdata, sortob);
      var PostResult   = await this.repository.GetPosts(q);
      const myInstance = this;

      async function myFunction(PostResult,user) {
      
        for (const item of PostResult) {
          var is_like  = await EveryPostCheckLikedOrNot(item,user,myInstance);
          item.is_like =is_like; 
          var is_wishlist  = await EveryPostCheckWishlistOrNot(item,user,myInstance);
          item.is_wishlist =is_wishlist; 
        }
      
        return PostResult;
      }
      
      async function EveryPostCheckLikedOrNot(item,user,myInstance) {
        var checkexist = await myInstance.CheckPostIsLikedOrNOt(user,item._id);
        if(checkexist == null){
          return false;
        }else{
          return true;
        }
        // synchronous code here
      }
      async function EveryPostCheckWishlistOrNot(item,user,myInstance) {
        var checkexist = await myInstance.CheckPostIsWishlistOrNOt(user,item._id);
        if(checkexist == null){
          return false;
        }else{
          return true;

        }
        // synchronous code here
      }
      if(matchdata.user != undefined){
        PostResult =  await myFunction(PostResult,matchdata.user);
      }
      return PostResult;
    }catch(error){
      console.log(error)
      return error
    }
  }
  async PostById(id) {
    const PostResult = await this.repository.FindPostById(id);
    return PostResult;
  }
  async UpdatePost(formdata) {
    this.SaveMasterTag(formdata.post_tags)
    var categorydata = await this.SavePostCategory(formdata.category_name);
    formdata.category_slug = categorydata.category_slug;

    const PostResult = await this.repository.UpdatePost(formdata);
    return PostResult;
  }
  async DeletePost(id) {
    const PostResult = await this.repository.DeletePost(id);
    return [];
  }
  async RemovePostLike(userinputs) {
    const PostResult = await this.repository.RemovePostLike(userinputs.user,userinputs.post);
    return [];
  }
  async RemovePostWishlist(userinputs) {
    const PostResult = await this.repository.RemovePostWishlist(userinputs.user,userinputs.post);
    return [];
  }
}

module.exports = PostService;
