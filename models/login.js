


const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const loginSchema = new Schema({
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

    status:
    {
        type: String,
        default: "New" // document default will be open
    },

    dateCreated:
    {
        type:Date,
        default:Date.now()
    }
  });

  
  const Login = mongoose.model('Login',loginSchema);
  
  module.exports=Login;


  