//Name: Kim Phuong Tu
//StudentID: 148886179
const express = require("express");
const handlebars= require("express-handlebars");
const productModel=require("./models/product");
const categoriesModel=require("./models/categories");
const bodyParser = require('body-parser');

const app= express();
app.engine('handlebars',handlebars());
app.set('view engine', 'handlebars');


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/",(req,res)=>{

    res.render("home",         
    {
        title: "Home",
        categoriesShow: categoriesModel.getAllProduct(),
        bestsellerShow: productModel.getBestSeller(),
    })
});


app.get("/customer",(req,res)=>{
    res.render("customer",
    {
        title: "Customer Registration"
    })
    
});

app.get("/login",(req,res)=>{
    res.render("login",
    {
        title: "Login"
    })
    
});

app.get("/products",(req,res)=>{
        res.render("products",
        {
            title: "Products",
            productShow: productModel.getAllProduct(),
          
        })

});

app.post("/login",(req,res)=>{     
    const errorMessages=[];

    if(req.body.email =="") 
    {
            errorMessages.push("Enter your email");
    }             


    if(req.body.password=="")
    {
        errorMessages.push("Enter your password");
    }


    //THere is an error
    if(errorMessages.length>0)
    {
        res.render("login",{
            title:"Login",
            messages:errorMessages  ,             
            email: req.body.email,         
            password:req.body.password  
                      
        })
    }
    
    // there is no error
    else
    {
        res.render("login",{
            title:"Login",
            message:`We will contact ${req.body.email}` 
         })
    }
    

});



const PORT=9000;
app.listen(PORT,()=>{
    console.log(`SERVER CONNECTION`);
})