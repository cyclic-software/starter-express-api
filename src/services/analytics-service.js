const { AnalyticsRepository ,PostRepository,UserRepository} = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class AnalyticsService {
  constructor() {
    this.repository = new AnalyticsRepository();
    this.PostRepository = new PostRepository();
    this.UserRepository = new UserRepository();
  }

  async AddAnalytics(userInputs) {
  var postdata = await  this.PostRepository.FindPostById(userInputs.post_id)
  var userdata = await  this.UserRepository.FindUserById(userInputs.user_id)
  if(postdata.length != 0){
    
    userInputs.post_name = postdata[0].post_name 
    userInputs.category_name = postdata[0].category_name 
    userInputs.category_id = postdata[0].category_id 
    userInputs.poet_name = postdata[0].poet_name 
    userInputs.poet_id = postdata[0].poet_id 
  }
  if(userdata.length != 0){
    userInputs.user_mobile = userdata[0].user_mobile 
    userInputs.user_email = userdata[0].user_email 
  }

  
  
    const AnalyticsResult = await this.repository.CreateAnalytics(userInputs);
    return AnalyticsResult;
  }
  async Analyticss(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const AnalyticsResult = await this.repository.GetAnalyticss(q);
    return AnalyticsResult;
  }
  async AdminAnalyticss() {

    const AnalyticsResult = await this.repository.GetAdminAnalyticss();
    return AnalyticsResult;
  }
  async AnalyticsById(id) {
    const AnalyticsResult = await this.repository.FindAnalyticsById(id);
    return AnalyticsResult;
  }
  async UpdateAnalytics(formdata) {
    const AnalyticsResult = await this.repository.UpdateAnalytics(formdata);
    return AnalyticsResult;
  }
  async DeleteAnalytics(formdata) {
    const AnalyticsResult = await this.repository.DeleteAnalytics(formdata);
    var data = this.AnalyticsById(formdata['id']);
    return data;
  }
}

module.exports = AnalyticsService;
