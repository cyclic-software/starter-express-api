const { user } = require('firebase-functions/v1/auth');
const { PostRepository, TagRepository, CategoryRepository ,PoetRepository} = require('../database');
const { FormateData, paginateResults } = require('../utils');

var AnalyticsService = require('./analytics-service');
var AnalyticsService = new AnalyticsService();


var NotificationService = require('./notification-service');
var NotificationService = new NotificationService();

// All Business logic will be here
class PostService {
  constructor() {
    this.repository = new PostRepository();
    this.TagRepository = new TagRepository();
    this.CategoryRepository = new CategoryRepository();
    this.PoetRepository = new PoetRepository();
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
      var custjson = {
        user_id:userInputs.user,
        post_id:userInputs.post,
        anallytics_type:"like",
      }
      
      await AnalyticsService.AddAnalytics(custjson)
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
    try {
      
      var checkexist = await this.CheckPostIsWishlistOrNOt(userInputs.user,userInputs.post)
      if(checkexist == null){
        const PostResult = await this.repository.PostWishlistAdd(userInputs);
        var custjson = {
          user_id:userInputs.user,
          post_id:userInputs.post,
          anallytics_type:"wishlist",
        }
        
        await AnalyticsService.AddAnalytics(custjson)
        return PostResult;
      }else{
        return checkexist;
  
      }
    } catch (error) {
      console.log(error)
      return error
      
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
      // var extra_query = {
      //   '$match': {
      //       $or:[
      //         {reel_video_link: { $eq: ""}},
      //         {reel_video_link: { $eq: null}},
      //         {reel_video_link:{$exists:false}}
      //       ]
      //   }
      // };
      //   matchdata["extra_query"] =   extra_query  

      var q = await paginateResults(size, skip, matchdata, sortob);
      
      var q2  =  {
          '$lookup': {
            'from': 'categories', 
            'localField': 'category_id', 
            'foreignField': '_id', 
            'as': 'category_data'
          }
        }
         q.push(q2)
         var q3 = {
          '$lookup': {
            'from': 'poets', 
            'localField': 'poet_id', 
            'foreignField': '_id', 
            'as': 'poet_data'
          }
        }
        q.push(q3)

      
      var PostResult   = await this.repository.GetPosts(q);
      const myInstance = this;

      async function myFunction(PostResult,user) {
      
        for (const item of PostResult) {
          var is_like  = await EveryPostCheckLikedOrNot(item,user,myInstance);
          item.is_like =is_like; 
          var is_wishlist  = await EveryPostCheckWishlistOrNot(item,user,myInstance);
          item.is_wishlist =is_wishlist; 
          item.poet_image_url = ""
          item.category_media_url = ""
          if(item.poet_data.length !=0){
               item.poet_image_url = item.poet_data[0].profile_media_url
               item.is_blue_tick = item.poet_data[0].is_blue_tick
          }
          if(item.category_data.length !=0){
               item.category_media_url = item.category_data[0].category_media_url
          }
          // if(item.poet_id !="" && item.poet_id !=null ){
          //   item.poet_data = await  myInstance.PoetRepository.FindPoetById(item.poet_id)
          // }
          // if(item.category_id !="" && item.category_id !=null ){
          //   item.category_data = await  myInstance.CategoryRepository.FindCategoryById(item.category_id)

          // }
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
  async GetAllReels(size, skip, matchdata, sortob) {
    try{

      matchdata["post_status"] = "Published";
      var extra_query =  {
        '$match': {
          '$and': [
            {
              'reel_video_link': {
                '$ne': ''
              }
            },
            {
              'reel_video_link': {
                '$ne': null
              }
            }, {
              'reel_video_link': {
                '$exists': true
              }
            }
          ]
        }
      };
        matchdata["extra_query"] =   extra_query  
      var q = await paginateResults(size, skip, matchdata, sortob);
      console.log(JSON.stringify(q))
      var q2  =  {
        '$lookup': {
          'from': 'categories', 
          'localField': 'category_id', 
          'foreignField': '_id', 
          'as': 'category_data'
        }
      }
       q.push(q2)
       var q3 = {
        '$lookup': {
          'from': 'poets', 
          'localField': 'poet_id', 
          'foreignField': '_id', 
          'as': 'poet_data'
        }
      }
      q.push(q3)
      var PostResult   = await this.repository.GetPosts(q);
      const myInstance = this;

      async function myFunction(PostResult,user) {
      
        for (const item of PostResult) {
          var is_like  = await EveryPostCheckLikedOrNot(item,user,myInstance);
          item.is_like =is_like; 
          var is_wishlist  = await EveryPostCheckWishlistOrNot(item,user,myInstance);
          item.is_wishlist =is_wishlist; 
          item.poet_image_url = ""
          item.category_media_url = ""
          if(item.poet_data.length !=0){
               item.poet_image_url = item.poet_data[0].profile_media_url
               item.is_blue_tick = item.poet_data[0].is_blue_tick

          }
          if(item.category_data.length !=0){
               item.category_media_url = item.category_data[0].category_media_url
          }
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
  async SearchPost(search,page,size) {

    try{

      

      var PostResult   = await this.repository.SearchPosts(search,page,size);

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
 

  async GetPostsForNotifictaion() {
    try{
     
      var PostResult   = await this.repository.NotificationGetPost();
      var postdata  =  PostResult[0]
      
      var userInputs = {
          title:postdata.post_name,
          body: postdata.post_description,
          media_url: postdata.post_media_url[0],
        data: postdata,
      };  
      


      await NotificationService.SendNotificationToAllUser(userInputs)
      // var formdata = {
      //   id:postdata._id,
      //   is_sent_notification:true
      // }
      // await this.repository.UpdatePost(formdata)
      return PostResult;
    }catch(error){
      console.log(error)
      return error
    }
  }
}

module.exports = PostService;
