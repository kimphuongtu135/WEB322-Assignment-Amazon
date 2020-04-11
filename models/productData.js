
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productDBSchema = new Schema({
    productName:
    {
        type: String,
        required: true
    },
    productPrice:
    {
        type: String,
        required: true
    },
    productDetail:
    {
        type: String,
        required: true
    },
    productCategory:
    {
        type: String,
        required: true
    },
    productQuantity:
    {
        type: Number,
        required: true
    },
    bestSeller:
    {
        type: Boolean,
        default: "false"
    },
    productPic:
    {
        type:String
    },
    dateCreated:
    {
        type: Date,
        default: Date.now()
    }
});




const productDB = mongoose.model('Product', productDBSchema);

module.exports = productDB;


