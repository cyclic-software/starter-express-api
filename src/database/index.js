// database related modules
module.exports = {
  databaseConnection: require('./connection'),
  SliderRepository: require('./repository/slider-repository'),
  PostRepository: require('./repository/post-repository'),
  CategoryRepository: require('./repository/category-repository'),
  PoetRepository: require('./repository/poet-repository'),
  TagRepository: require('./repository/tag-repository'),
  NotificationRepository: require('./repository/notification-repository'),
  AdminregistryRepository: require('./repository/adminregistry-repository'),
  ContactusRepository: require('./repository/contactus-repository'),
  FeedbackRepository: require('./repository/feedback-repository'),
  UserRepository: require('./repository/user-repository'),
  MediaRepository: require('./repository/media-repository'),  
  AnalyticsRepository: require('./repository/analytics-repository')  
};
