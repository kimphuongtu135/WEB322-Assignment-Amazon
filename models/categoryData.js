
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryDBSchema = new Schema({
    categoryName:
    {
        type: String,
        required: true
    },
    categoryPic:
    {
        type:String
    },
    dateCreated:
    {
        type: Date,
        default: Date.now()
    }
});

const cateDB = mongoose.model('Category', categoryDBSchema);

module.exports = cateDB;


