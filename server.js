//Name: Kim Phuong Tu
//StudentID: 148886179
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require('body-parser');
require('dotenv').config({path:"./config/keys.env"});

const app = express();
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

//load controllers
const generalController=require("./controllers/general");
const productController=require("./controllers/product");


app.use("/",generalController);
app.use("/products",productController);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`SERVER CONNECTION`);
})