// database related modules
module.exports = {
  databaseConnection: require('./connection'),

  SliderRepository: require('./repository/slider-repository'),
  CategoryRepository: require('./repository/category-repository'),
  TagRepository: require('./repository/tag-repository'),
  UserRepository: require('./repository/user-repository'),
  MediaRepository: require('./repository/media-repository'),

};
