const { FeedbackRepository } = require('../database');
const { FormateData, paginateResults } = require('../utils');

// All Business logic will be here
class FeedbackService {
  constructor() {
    this.repository = new FeedbackRepository();
  }

  async AddFeedback(userInputs) {
    const FeedbackResult = await this.repository.CreateFeedback(userInputs);
    return FeedbackResult;
  }
  async Feedbacks(size, skip, matchdata, sortob) {
    var q = await paginateResults(size, skip, matchdata, sortob);
    const FeedbackResult = await this.repository.GetFeedbacks(q);
    return FeedbackResult;
  }
  async FeedbackById(id) {
    const FeedbackResult = await this.repository.FindFeedbackById(id);
    return FeedbackResult;
  }
  async UpdateFeedback(formdata) {
    const FeedbackResult = await this.repository.UpdateFeedback(formdata);
    return FeedbackResult;
  }
  async DeleteFeedback(formdata) {
    const FeedbackResult = await this.repository.DeleteFeedback(formdata);
    var data = this.FeedbackById(formdata['id']);
    return data;
  }
}

module.exports = FeedbackService;
