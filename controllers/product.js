const express = require('express')
const router = express.Router()

const productModel = require("../models/product");

router.get("/", (req, res) => {
    res.render("products/products",
        {
            title: "Products",
            productShow: productModel.getAllProduct(),

        })

});


module.exports=router;