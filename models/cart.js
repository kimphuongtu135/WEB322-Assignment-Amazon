
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartDBSchema = new Schema({
    userId:
    {
        type: String,
        required: true
    },
    itemId:
    {
        type: String,
        required: true
    },
    orderedQuantity:
    {
        type:Number,
        required: true
    },
    dateCreated:
    {
        type: Date,
        default: Date.now()
    }
});

const cartDB = mongoose.model('shoppingCart', cartDBSchema);

module.exports = cartDB;


