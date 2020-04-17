const express = require('express')
const router = express.Router()
const productModel = require("../models/product");
const isLogin = require("../middleware/auth");
const productDBModel = require("../models/productData");
const categoryDBModel = require("../models/categoryData");
const cartDBModel = require("../models/cart");
const transferProduct = require("../models/product");
const categoriesModel = require("../models/categories");
const path = require("path");



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
                            productShow: mapProduct,
                            categoriesShow: mapCategories,
                        })

                })
                .catch(err => console.log(`Error happened when pulling data from the database :${err}`));
        })
        .catch(err => console.log(`Error happened when pulling data from the database :${err}`));

});

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
    // Admin add product


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
            // if image is not supported, error displayed
            const errorMessage = [];
            if (!req.files.productPic || !(path.parse(req.files.productPic.name).ext === ".png") || !(path.parse(req.files.productPic.name).ext === ".jgp") || !(path.parse(req.files.productPic.name).ext === ".gif")) {
                errorMessage.push("Your file type is incorrect!");

                res.render("products/productsAddForm",
                    {
                        title: "Add Products",
                        pname: req.body.pname,
                        pprice: req.body.pprice,
                        pdetail: req.body.pdetail,
                        pcate: req.body.pcate,
                        pquan: req.body.pquan,
                        errorMessage,
                    })
            }
            else {
                req.files.productPic.name = `pic_${product._id}${req.files.productPic.name}`;
                console.log(req.files.productPic.name)
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
            }
        })
        .catch(err => console.log(`Error happened when inserting into the database :${err}`));

});

//Only admin can view all product
router.get("/profile/viewProduct", isLogin, (req, res) => {
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

router.put("/updateProduct/:id", isLogin, (req, res) => {

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
    productDBModel.find({ productName: new RegExp(req.body.search, 'i') }).lean()
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
            res.render("products/products", {
                title: "Products",
                productShow: mapProduct
            });
        })
        .catch(err => console.log(`Error happened when searching product: ${err}`));
});

// Searching product by categories
router.get("/:productCategory", (req, res) => {
    categoryDBModel.find()
        .then((categories) => {
            const mapCategories = categories.map(cate => {
                return {
                    id: cate._id,
                    categoryName: cate.categoryName,
                    categoryPic: cate.categoryPic
                }
            });
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
                            categoriesShow: mapCategories
                        });

                })
                .catch(err => console.log(`Error happened when pulling data from the database :${err}`));
        })
        .catch(err => console.log(`Error happened when pulling data from the database :${err}`));
});

//Product Description Page
router.get("/productDecs/:id", (req, res) => {
    const message = [];
    productDBModel.findById(req.params.id)
        .then((product) => {
            const { _id, productName, productPrice, productDetail, productCategory, productQuantity, productPic } = product;
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
router.post("/productDecs/:id", isLogin, (req, res) => {
    const message = [];
    if (req.session.user.type != "Admin") {

        productDBModel.findById(req.params.id)
            .then((product) => {

                const custOrder = {
                    userId: req.session.user._id,
                    itemId: req.params.id,
                    orderedQuantity: req.body.pquan
                }
                const cart = new cartDBModel(custOrder);
                cart.save()
                    .then(() => {
                        const { _id, productName, productPrice, productDetail, productCategory, productQuantity, productPic } = product;
                        message.push("Your product is added to Cart")
                        res.render("products/productDecs", {
                            title: "Products Details",
                            _id,
                            productName,
                            productPrice,
                            productDetail,
                            productCategory,
                            productQuantity,
                            productPic,
                            orderedQuantity: req.body.pquan,
                            message
                        })

                    })
                    .catch(err => {
                        console.log(`Error occured while inserting data into database ${err}`);
                    });

            })
            .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
    }
    else {
        productDBModel.findById(req.params.id)
            .then((product) => {
                const { _id, productName, productPrice, productDetail, productCategory, productQuantity, productPic } = product;
                message.push("Your Account is not Customer Account")
                res.render("products/productDecs", {
                    title: "Products Details",
                    _id,
                    productName,
                    productPrice,
                    productDetail,
                    productCategory,
                    productQuantity,
                    productPic,
                    orderedQuantity: req.body.pquan,
                    message
                })
            })
            .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
    }
})

router.get("/profile/shoppingCart", isLogin, (req, res) => {

    cartDBModel.find({ userId: req.session.user._id })
        .then((custOrders) => {
            const mapproductId = custOrders.map(item => item.itemId)


            productDBModel.find({" _id":{"$in": mapproductId} })
                .then((products) => {
                    const mapProduct = products.map(product => {
                        let totalPrice = 0;
                        totalPrice +=product.productPrice * item.orderedQuantity; 
                        console.log("totalprice",totalPrice)   
                        console.log("quantity",item.orderedQuantity)
                        for (let i = 0; i < mapproductId.length; i++) {
                            
                                console.log(totalPrice);
                            if (product._id == mapproductId[i]) {
                                return {
                                    id: product._id,
                                    productName: product.productName,
                                    productPrice: product.productPrice,
                                    productDetail: product.productDetail,
                                    productCategory: product.productCategory,
                                    productQuantity: product.productQuantity,
                                    productPic: product.productPic,
                                }
                               
                            } 
                            
                        }
                    });
                   // console.log(mapProduct);
                    res.render("products/cart",
                        {
                            title: "Shopping Cart",

                            productShow: mapProduct,
                            totalPrice:totalPrice
                        });

                })
                .catch(err => console.log(`Error happened when pulling data from the database :${err}`));

        })
        .catch(err => console.log(`Error happened while finding ID in cart database  :${err}`));
});


// let objFinal = {
//     arrayFinal: []
// }
// router.post("/productDecs/:id", isLogin, (req, res) => {
//     let cartItem = {};
//     productDBModel.findById(req.params.id)
//         .then((product) => {

//             const { _id, productName, productPrice, productDetail, productCategory, productQuantity, productPic } = product;

//             cartItem =
//             {
//                 _id, productName, productPrice, productDetail, productCategory, productQuantity, productPic,
//                 orderedQuantity: req.body.pquan
//             }
//             // arrayCart.push(cartItem);

//             objFinal.arrayFinal.push(cartItem);
//             //console.log('áfter pushing caritem: ', objFinal.arrayFinal)
//             // console.log('before: ', req.session.cart)
//             req.session.cart = { ...objFinal };
//             let totalPrice = 0;
//             for (let i = 0; i < objFinal.arrayFinal.length; i++) {
//                 totalPrice += Number(objFinal.arrayFinal[i].orderedQuantity) * objFinal.arrayFinal[i].productPrice;
//                 objFinal.arrayFinal[i].productQuantity -= Number(objFinal.arrayFinal[i].orderedQuantity);

//             productDBModel.updateOne({ _id: req.params.id }, objFinal.arrayFinal[i])
//         .then(() => {
//             req.session.cart.totalPrice = totalPrice;
//             console.log("left product:",objFinal.arrayFinal[i].productQuantity );
//             console.log("totalPrice:", req.session.cart.totalPrice );
//             res.redirect("/products/profile");
//             console.log("add cart successfull");

//         })

//         .catch(err => console.log(`Error with updating data from the database :${err}`));
//     }
//         })

//         .catch(err => console.log(`Error happened while adding product to cart  :${err}`));

// })
// // Shopping Cart 
// router.get("/profile/shoppingCart", isLogin, (req, res) => {
//    // console.log('get shopping cart: ', req.session.cart)
//     req.session.cart.arrayFinal.forEach((item) => {
//         const itemShow = {
//             id: item._id,
//             productName: item.productName,
//             productPrice: item.productPrice,
//             productQuantity: item.productQuantity,
//             productDetail: item.productDetail,
//             productPic: item.productPic
//         }
//         const items = [];
//         items.push(itemShow);
//         console.log('item: ', itemShow);
//         res.render("products/cart",
//             {
//                 title: "Shopping Cart",

//                 productShow: items,
//             });

//     });

// });


module.exports = router;