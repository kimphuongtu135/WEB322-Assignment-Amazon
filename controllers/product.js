const express = require('express')
const router = express.Router()
const productModel = require("../models/product");
const isLogin=require("../middleware/auth");
const productDBModel = require("../models/productData");

router.get("/", (req, res) => {
    res.render("products/products",
        {
            title: "Products",
            productShow: productModel.getAllProduct(),

        })

});

router.get("/add",isLogin,(req,res)=>
{
    res.render("products/productsAddForm",
    {
        title: "Add Products",
        

    })
});

router.post("/add",(req,res)=>
{
        const newProduct = {
            productName : req.body.pname,
            productPrice : req.body.pprice,
            productDetail : req.body.pdetail,
            productCategory  : req.body.pcate,
            productQuantity : req.body.pquan,
            bestSeller : req.body.pbest==='true'?true:false
        }

     const product =  new productDBModel(newProduct);
     product.save()
     .then(()=>{
         res.redirect("/profile")
     })
     .catch(err=>console.log(`Error happened when inserting in the database :${err}`));
});


module.exports=router;