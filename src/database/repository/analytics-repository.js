const mongoose = require('mongoose');
const { AnalyticsModel,PostModel ,UserModel,PoetModel,CategoryModel,FeedbackModel,MediaModel} = require('../models');

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
  async GetAdminAnalyticss() {
   
    var query = [
      {
        '$group': {
          '_id': '$anallytics_type', 
          'count': {
            '$count': {}
          }
        }
      }, {
        '$sort': {
          'count': -1
        }
      }, {
        '$project': {
          '_id': 0, 
          'label': {
            '$toUpper': '$_id'
          }, 
          'count': 1
        }
      }
    ]
    var templates = await AnalyticsModel.aggregate(query);
    templates = templates.map(item => {
      return {
          count: item.count,
          label:  "POST " +item.label 
      };
  });
  
    var totalusercount = await this.TotalUsersCount();
    var totalpublishedpost = await this.TotalPublishedPOST();
    var totaldraftpost = await this.TotalDraftPOST();
    var totalpoet = await this.TotalPoet();
    var totalcategoy = await this.TotalCagtegory();
    var totalfeedback = await this.TotalFeedback();
    templates.unshift(totalpublishedpost);
    templates.unshift(totalpoet);
    templates.unshift(totaldraftpost);
    templates.unshift(totalusercount);
    templates.unshift(totalcategoy);
    templates.unshift(totalfeedback);

    templates.sort((a, b) => b.count - a.count);

    return templates;
  }
  async TotalUsersCount() {
   var query =  [
      {
        '$count': 'usercount'
      }, {
        '$project': {
          'count': '$usercount', 
          'label': 'Total USERS'
        }
      }
    ]
    const analyticss = await UserModel.aggregate(query);
    return analyticss[0];
  }
  async TotalPublishedPOST() {
    var query =  [
      {
        '$match': {
          'post_status': 'Published'
        }
      },
       {
         '$count': 'postcount'
       }, {
         '$project': {
           'count': '$postcount', 
           'label': 'Total Published POST'
         }
       }
     ]
     const analyticss = await PostModel.aggregate(query);
     return analyticss[0];
   }
   async TotalDraftPOST() {
    var query =  [
      {
        '$match': {
          'post_status': 'Draft'
        }
      },
       {
         '$count': 'postcount'
       }, {
         '$project': {
           'count': '$postcount', 
           'label': 'Total Draft POST'
         }
       }
     ]
     const analyticss = await PostModel.aggregate(query);
     return analyticss[0];
   }
   async TotalPoet() {
    var query =  [
      {
        '$match': {
          'poet_status': 'Published'
        }
      },
       {
         '$count': 'postcount'
       }, {
         '$project': {
           'count': '$postcount', 
           'label': 'Total Poet'
         }
       }
     ]
     const analyticss = await PoetModel.aggregate(query);
     return analyticss[0];
   }
   async TotalCagtegory() {
    var query =  [
      
       {
         '$count': 'cateogorycount'
       }, {
         '$project': {
           'count': '$cateogorycount', 
           'label': 'Total Category'
         }
       }
     ]
     const analyticss = await CategoryModel.aggregate(query);
     return analyticss[0];
   }
   async TotalFeedback() {
    var query =  [
      
       {
         '$count': 'feedback'
       }, {
         '$project': {
           'count': '$feedback', 
           'label': 'Total Feedback'
         }
       }
     ]
     const analyticss = await FeedbackModel.aggregate(query);
     return analyticss[0];
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
