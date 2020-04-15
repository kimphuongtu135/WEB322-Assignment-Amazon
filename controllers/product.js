const express = require('express')
const router = express.Router()
const productModel = require("../models/product");
const isLogin = require("../middleware/auth");
const productDBModel = require("../models/productData");
const categoryDBModel = require("../models/categoryData");
const transferProduct = require("../models/product");
const categoriesModel = require("../models/categories");





router.get("/", (req, res) => {
    //Pulling data from productDataModel to here
    categoryDBModel.find()
        .then((categories) => {
            const mapCategories = categories.map(cate => {
                return {
                    id: cate._id,
                    categoryName: cate.categoryName,
                    categoryPic: cate.categoryPic
                }
            });

            productDBModel.find()
                .then((products) => {

                    const mapProduct = products.map(product => {
                        return {
                            id: product._id,
                            productName: product.productName,
                            productPrice: product.productPrice,
                            productDetail: product.productDetail,
                            productCategory: product.productCategory,
                            productQuantity: product.productQuantity,
                            bestSeller: product.bestSeller,
                            productPic: product.productPic
                        }
                    });



                    res.render("products/products",
                        {
                            title: "Products",
                            //productShow: productModel.getAllProduct(),
                            productShow: mapProduct,
                            categoriesShow: mapCategories,

                        })

                })
                .catch(err => console.log(`Error happened when pulling data from the database :${err}`));
        })
        .catch(err => console.log(`Error happened when pulling data from the database :${err}`));

});
// Admin add product
router.get("/profile/add", isLogin, (req, res) => {

    res.render("products/productsAddForm",
        {
            title: "Add Products",

        })
});



//Temporary router for convert manual database to MongoDB database
router.get("/convert", (req, res) => {
    //get all data from product models before
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
                productDBModel.updateOne({ _id: product._id }, {
                    $set: {
                        productPic: transferProduct.fakeDB[i].src
                    }
                })
                    .then(() => res.send('.'))
                    .catch(err => console.log(`Error happened when inserting into the database :${err}`));

            })
            .catch(err => console.log(`Error happened when inserting into the database :${err}`));
    }

});
//temporary router for converting categories data to Database
router.get("/convertcate", (req, res) => {
    categoriesModel.init();
    for (let i = 0; i < categoriesModel.fakeDB.length; i++) {
        const transferProduct1 = {
            categoryName: categoriesModel.fakeDB[i].name,
            categoryPic: categoriesModel.fakeDB[i].src
        }
        const cate = new categoryDBModel(transferProduct1);
        cate.save()
            .then((cate) => {
                categoriesModel.fakeDB[i].src = `pic_${cate._id}${categoriesModel.fakeDB[i].src}`;
                categoryDBModel.updateOne({ _id: cate._id }, {
                    $set: {
                        categoryPic: categoriesModel.fakeDB[i].src
                    }
                })
                    .then(() => res.send('.'))
                    .catch(err => console.log(`Error happened when inserting into the database :${err}`));

            })
            .catch(err => console.log(`Error happened when inserting into the database :${err}`));
    }

});




router.post("/profile/add", (req, res) => {

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
        .catch(err => console.log(`Error happened when inserting into the database :${err}`));
});

//Only admin can view all product
router.get("/profile/viewProduct", isLogin, (req, res) => {
    //console.log(`Hello`);
    productDBModel.find()
        .then((products) => {

            const mapProduct = products.map(product => {
                return {
                    id: product._id,
                    productName: product.productName,
                    productPrice: product.productPrice,
                    productDetail: product.productDetail,
                    productCategory: product.productCategory,
                    productQuantity: product.productQuantity,
                    bestSeller: product.bestSeller,
                    productPic: product.productPic
                }
            });

            res.render("products/viewAllProduct",
                {
                    title: "View Products",

                    productShow: mapProduct,
                })
        })
        .catch(err => console.log(`Error happened when pulling data from the database :${err}`));

});



router.get("/editProduct/:id", isLogin, (req, res) => {

    productDBModel.findById(req.params.id)
        .then((product) => {
            const { _id, productName, productPrice, productDetail, productCategory, productQuantity } = product;
            res.render("products/productsEditForm", {
                title: "Edit Products",
                _id,
                productName,
                productPrice,
                productDetail,
                productCategory,
                productQuantity
            })

        })
        .catch(err => console.log(`Error  editing from the database :${err}`));
})

router.put("/updateProduct/:id",isLogin, (req, res) => {

    const product = {
        productName: req.body.pname,
        productPrice: req.body.pprice,
        productDetail: req.body.pdetail,
        productCategory: req.body.pcate,
        productQuantity: req.body.pquan
    }
    productDBModel.updateOne({ _id: req.params.id }, product)
        .then(() => {
            res.redirect("/products/profile/viewProduct");
        })
        .catch(err => console.log(`Error with updating data from the database :${err}`));
});


router.delete("/deleteProduct/:id", (req, res) => {

    productDBModel.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/products/profile/viewProduct");
        })
        .catch(err => console.log(`Error with deleting data from the database :${err}`));
});
//seaarch by keyword
router.post("/search", (req, res) => {
    productName=`${req.body.productName}`;
    const viewProduct = [];
    console.log(`Hello`);
    // `${req.body.productName}` = new RegExp(`${req.body.productName}`,'i');
   filter = { productName: { $regex: `.*${req.body.productName}.*`, $option: 'i' } };
    productDBModel.find(filter)
        .then((foundProduct) => {
            if (foundProduct == null) {
                res.render("products/products", {
                    title: "Products", 
                    showProduct: viewProduct
                });
            }
            else {
                foundProduct.forEach(product => {
                    viewProduct.push(product);
                });
                res.render("products/products", {
                    title: "Products",
                    showProduct: viewProduct
                });
            }
        })
        .catch(err => console.log(`Error happened when searching product: ${err}`));
});

// Searching product by categories
router.get("/:productCategory", (req, res) => {

    productDBModel.find({ productCategory: req.params.productCategory })
        .then((products) => {

            const mapProduct = products.map(product => {
                return {
                    id: product._id,
                    productName: product.productName,
                    productPrice: product.productPrice,
                    productDetail: product.productDetail,
                    productCategory: product.productCategory,
                    productQuantity: product.productQuantity,
                    bestSeller: product.bestSeller,
                    productPic: product.productPic
                }
            });

            res.render("products/products",
                {
                    title: "Products",
                    productShow: mapProduct,
                })

        })
        .catch(err => console.log(`Error happened when pulling data from the database :${err}`));
});
//Product Description Page
router.get("/productDecs/:id", (req, res) => {
    const message=[];
    productDBModel.findById(req.params.id)
        .then((product) => {
            
            const { _id, productName, productPrice, productDetail, productCategory, productQuantity,productPic } = product;
            message.push("Login is required for adding product")
            res.render("products/productDecs", {
                title: "Products Details",
                _id,
                productName,
                productPrice,
                productDetail,
                productCategory,
                productQuantity,
                productPic,
                message
            })
        
        })
        .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
})

router.post("/productDecs/:id", (req, res) => {
    const message=[];
    productDBModel.findById(req.params.id)
    .then((product) => {
        message.push("Adding product successfully")
        const { _id, productName, productPrice, productDetail, productCategory, productQuantity,productPic } = product;
        res.render("products/productDecs", {
            title: "Products Details",
            _id,
            productName,
            productPrice,
            productDetail,
            productCategory,
            productQuantity,
            productPic,
            message
        })
    })
    .catch(err => console.log(`Error happened while adding product to cart  :${err}`));
    
})
// Shopping Cart 

router.get("/shoppingCart", (req, res) => {
    
});

module.exports = router;