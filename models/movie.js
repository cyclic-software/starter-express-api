var mongoose = require('mongoose');
var Schema = mongoose.Schema;
MovieSchema = new Schema({
      plot:   String , 
      genres:   [String] , 
      runtime:   Number , 
      cast:   [String] , 
      poster:   String , 
      title:   String , 
      fullplot:   String , 
      languages:   [String] , 
      released:   Date , 
      directors:   [String] , 
      rated:   String , 
      awards:   Object , 
      lastupdated:   String , 
      year:   Number , 
      imdb:   Object , 
      countries:   [String] , 
      type:   String , 
      tomatoes:   Object , 
      num_mflix_comments:   Number , 
    });

module.exports = mongoose.model('movies', MovieSchema);