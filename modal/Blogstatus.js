var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  statusname: { type: String,  required: [true, 'Status name must be provided'] },
  
},{
  collection: 'blogstatus'
});

module.exports = mongoose.model('Blogstatus', userSchema);