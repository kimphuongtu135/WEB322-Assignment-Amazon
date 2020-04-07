
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

  dateCreated:
  {
      type:Date,
      default:Date.now()
  }
});


const Register = mongoose.model('Register',registerSchema);

module.exports=Register;


