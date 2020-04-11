
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
    firstName:
    {
        type: String,
        required: true
    },
    lastName:
    {
        type: String,
        required: true
    },

    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    type:
    {
        type: String,
        default: "User"
    },

    dateCreated:
    {
        type: Date,
        default: Date.now()
    }
});

registerSchema.pre("save", function (next) {


    bcrypt.genSalt(12)
        .then((salt) => {

            bcrypt.hash(this.password, salt)
                .then((encryptPassword) => {
                    this.password = encryptPassword;
                    next();

                })
                .catch(err => console.log(`Error happened while hasing ${err}`));
        })
        .catch(err => console.log(`Error happened while salting ${err}`));



})

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;


