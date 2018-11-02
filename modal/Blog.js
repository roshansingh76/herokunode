var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    title: { type: String },
    slug: { type: String },
    detail: { type:String },
    meta_title:{type:String },
    meta_description:{type:String },
    meta_keyword:{type:String },
    image:{type:String },
    status: [{ type: Schema.Types.ObjectId, ref: 'Blogstatus' }],
    created_at: {type:Date,default: Date.now},


},{
  collection: 'blog'
});

module.exports = mongoose.model('Blog', userSchema);