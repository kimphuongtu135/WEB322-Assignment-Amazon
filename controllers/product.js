const express = require('express')
const router = express.Router()
const productModel = require("../models/product");
const isLogin = require("../middleware/auth");
const productDBModel = require("../models/productData");
const path = require("path");
const transferProduct = require("../models/product");
const productDataModel = require("../models/productData");


router.get("/", (req, res) => {
    //Pulling data from productDataModel to here
    productDBModel.find()
    .then((products)=>{

        const mapProduct=products.map(product=>{
            return{
                id:product._id,
                productName: product.productName,
                 productPrice: product.productPrice,
                 productDetail: product.productDetail,
                 productCategory: product.productCategory,
                 productQuantity:product.productQuantity,
                 bestSeller: product.bestSeller,
                 productPic: product.productPic
            }
        });



        res.render("products/products",
        {
            title: "Products",
            //productShow: productModel.getAllProduct(),
            productShow:mapProduct ,

        })

    })
    .catch(err => console.log(`Error happened when pulling data from the database :${err}`));

});

router.get("/add", isLogin, (req, res) => {

    res.render("products/productsAddForm",
        {
            title: "Add Products",


        })
});


router.get("/convert", (req, res) => {
    transferProduct.init();
    for (let i = 0; i < transferProduct.fakeDB.length; i++) {
        const transferProduct1 = {
            productName: transferProduct.fakeDB[i].name,
            productPrice: transferProduct.fakeDB[i].price,
            productDetail: transferProduct.fakeDB[i].description,
            productCategory: transferProduct.fakeDB[i].type,
            bestSeller: transferProduct.fakeDB[i].bestseller,
            productPic: transferProduct.fakeDB[i].src
        }
        const product = new productDBModel(transferProduct1);
        product.save()
            .then((product) => {
                transferProduct.fakeDB[i].src = `pic_${product._id}${transferProduct.fakeDB[i].src}`;
                console.log(transferProduct.fakeDB[i].src);
                productDBModel.updateOne({ _id: product._id }, {
                    $set: {

                        productPic: transferProduct.fakeDB[i].src
                    }
                })
                .then(() => res.send('.'))
                .catch(err => console.log(`Error happened when inserting in the database :${err}`));

            })
            .catch(err => console.log(`Error happened when inserting in the database :${err}`));
    }

});


router.post("/add", (req, res) => {

    const newProduct = {
        productName: req.body.pname,
        productPrice: req.body.pprice,
        productDetail: req.body.pdetail,
        productCategory: req.body.pcate,
        productQuantity: req.body.pquan,
        bestSeller: req.body.pbest === 'true' ? true : false,
        productPic: req.files.productPic.name

    }

    const product = new productDBModel(newProduct);
    product.save()
        .then((product) => {
            req.files.productPic.name = `pic_${product._id}${req.files.productPic.name}`;
            req.files.productPic.mv(`public/images/${req.files.productPic.name}`)
                .then(() => {
                    console.log(req.files.productPic.name)
                    productDBModel.updateOne({ _id: product._id }, {
                        productPic: req.files.productPic.name
                    })
                        .then(() => {
                            res.redirect("/profile")
                        })

                })

        })
        .catch(err => console.log(`Error happened when inserting in the database :${err}`));
});


module.exports = router;