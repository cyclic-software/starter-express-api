const { NotificationRepository,UserRepository } = require('../database');
const { FormateData, paginateResults,FilterNullValuesJsonForNotifiction } = require('../utils');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('./accountkey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: 'https://your-project-id.firebaseio.com'
  });
  
// All Business logic will be here
class NotificationService {
  constructor() {
    this.repository = new NotificationRepository();
    this.userrepository = new UserRepository();
  }

  async SendNotificationUser(userInputs,user_id_list){
    try{

        var user_fcm_token_list = await this.userrepository.GetUserFcmtoken(user_id_list)
        console.log(user_fcm_token_list)
        userInputs.user_fcm_token_list = user_fcm_token_list
        
        // for Firebase Send All Data Which has string not send boolean data it must be in String
        userInputs.data  = await FilterNullValuesJsonForNotifiction(userInputs.data)
        
        var message = {
            notification: {
              title:userInputs.title,
              body: userInputs.body,
              image: userInputs.media_url,
    
            },
            data: userInputs.data,
    
            tokens: user_fcm_token_list
          };
    
        var notifcation = await  admin.messaging().sendMulticast(message)
        const NotificationResult =   this.repository.CreateNotification(userInputs);
          return NotificationResult
           
    }catch(error){
        console.log(error)
        return false;
    }

  }
  async SendNotificationToAllUser(userInputs){
    try{
        
        var user_fcm_token_list = await this.userrepository.GetAllFcmToken()
        console.log(user_fcm_token_list)
        userInputs.user_fcm_token_list = user_fcm_token_list
        
        // for Firebase Send All Data Which has string not send boolean data it must be in String
        userInputs.data  = await FilterNullValuesJsonForNotifiction(userInputs.data)
        
        var message = {
            notification: {
              title:userInputs.title,
              body: userInputs.body,
              image: userInputs.media_url,
    
            },
            data: userInputs.data,
    
            tokens: user_fcm_token_list
          };
    
        var notifcation = await  admin.messaging().sendMulticast(message)
        const NotificationResult =   this.repository.CreateNotification(userInputs);
          return NotificationResult
           
    }catch(error){
        console.log(error)
        return false;
    }

  }
  async AddNotification(userInputs) {
   
        if(userInputs.type == "General" && userInputs.user_id_list.length == 0){
            var NotificationResult = await this.SendNotificationToAllUser(userInputs)
        }else{
            console.log("ds")
            var NotificationResult = await this.SendNotificationUser(userInputs,userInputs.user_id_list)
        }

    return NotificationResult;
  }
  async Notifications(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const NotificationResult = await this.repository.GetNotifications(q);
    return NotificationResult;
  }
  async NotificationById(id) {
    const NotificationResult = await this.repository.FindNotificationById(id);
    return NotificationResult;
  }
  async UpdateNotification(formdata) {
    const NotificationResult = await this.repository.UpdateNotification(formdata);
    return NotificationResult;
  }
  async DeleteNotification(formdata) {
    const NotificationResult = await this.repository.DeleteNotification(formdata);
    var data = this.NotificationById(formdata['id']);
    return data;
  }
}

module.exports = NotificationService;
