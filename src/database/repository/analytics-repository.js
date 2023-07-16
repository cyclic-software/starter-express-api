const mongoose = require('mongoose');
const { AnalyticsModel,PostModel } = require('../models');

//Dealing with data base operations
class AnalyticsRepository {
  async CreateAnalytics(userInputs) {
    const analyticss = new AnalyticsModel(userInputs);

    const analyticsresult = await analyticss.save();
    return analyticsresult;
  }

  async GetAnalyticss(query) {
    // var query = [
      
    //   {
    //     '$match': {
    //       'post_status': 'Published'
    //     }
    //   },{
    //     '$group': {
    //       '_id': '$analytics_id'
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
    const templates = await AnalyticsModel.aggregate(query);
    return templates;
  }
  async GetAdminAnalyticss(query) {
   
    const templates = await AnalyticsModel.aggregate(query);
    return templates;
  }
  async FindAnalyticsById(id) {
    const analyticss = await AnalyticsModel.find({ is_del: false, _id: id });
    return analyticss;
  }
  async UpdateAnalytics(formdata) {
    const template = await AnalyticsModel.updateOne(
      { _id: formdata['id'] },
      { $set: formdata },
    );
    const templatedata = await AnalyticsModel.find({ _id: formdata['id'] });
    return templatedata;
  }
  async DeleteAnalytics(formdata) {
    const template = await AnalyticsModel.updateOne(
      { _id: formdata['id'] },
      { $set: { is_del: true } },
    );
    return template;
  }
  async SearchAnalytics(analytics_name) {
    const analytics = await AnalyticsModel.findOne(
      { analytics_name: analytics_name },
    );
    return analytics;
  }
}

module.exports = AnalyticsRepository;
