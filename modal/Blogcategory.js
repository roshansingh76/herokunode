var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    blog_id: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
    category_id: [{ type: Schema.Types.ObjectId, ref: 'Categories' }],


},{
  collection: 'blogcategory'
});

module.exports = mongoose.model('Blogcategory', userSchema);