const express = require('express')
const router = express.Router()
const productModel = require("../models/product");
const isLogin = require("../middleware/auth");
const productDBModel = require("../models/productData");
const categoryDBModel = require("../models/categoryData");
const registerModel = require("../models/register");
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
    // if image is not supported, error displayed
    const errorMessage = [];
    if (!req.files) {
        errorMessage.push("You need to upload image!");
        res.render("products/productsAddForm",
            {
                title: "Add Products",
                errorMessage
            })
    }
    else {
        if (!req.files.productPic || !(path.parse(req.files.productPic.name).ext === ".png" || path.parse(req.files.productPic.name).ext === ".jpg" || path.parse(req.files.productPic.name).ext === ".JPG" || path.parse(req.files.productPic.name).ext === ".gif")) {
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
                            productDBModel.updateOne({ _id: product._id }, {
                                productPic: req.files.productPic.name
                            })
                                .then(() => {
                                    res.redirect("/profile")
                                })
                        })
                })
                .catch(err => console.log(`Error happened when inserting into the database :${err}`));
        }
    }
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
            const { _id, productName, productPrice, productDetail, productCategory, productQuantity, bestSeller } = product;
            res.render("products/productsEditForm", {
                title: "Edit Products",
                _id,
                productName,
                productPrice,
                productDetail,
                productCategory,
                productQuantity,
                bestSeller
            })
        })
        .catch(err => console.log(`Error  editing from the database :${err}`));
})

router.put("/updateProduct/:id", isLogin, (req, res) => {
    const errorMessage = [];
    const product = {
        productName: req.body.pname,
        productPrice: req.body.pprice,
        productDetail: req.body.pdetail,
        productCategory: req.body.pcate,
        productQuantity: req.body.pquan,
        bestSeller: req.body.pbest
    }
    if (!req.files) {
        productDBModel.updateOne({ _id: req.params.id }, product)
            .then(() => {
                res.redirect("/products/profile/viewProduct");
            })
            .catch(err => console.log(`Error with updating data from the database :${err}`));
    }
    else if (!(path.parse(req.files.productPic.name).ext === ".png" || path.parse(req.files.productPic.name).ext === ".jpg" || path.parse(req.files.productPic.name).ext === ".JPG" || path.parse(req.files.productPic.name).ext === ".gif")) {
        errorMessage.push("Your file type is incorrect!");
        productDBModel.findById(req.params.id)
            .then((product) => {
                const { _id, productName, productPrice, productDetail, productCategory, productQuantity, bestSeller } = product;
                res.render("products/productsEditForm", {
                    title: "Edit Products",
                    _id,
                    productName,
                    productPrice,
                    productDetail,
                    productCategory,
                    productQuantity,
                    bestSeller,
                    errorMessage
                })
            })
            .catch(err => console.log(`Error  editing from the database :${err}`));
    }
    else {
        productDBModel.updateOne({ _id: req.params.id }, product)
            .then(() => {

                req.files.productPic.name = `pic_${product._id}${req.files.productPic.name}`;
                req.files.productPic.mv(`public/images/${req.files.productPic.name}`)
                    .then(() => {
                        productDBModel.updateOne({ _id: req.params.id }, {
                            productPic: req.files.productPic.name
                        })
                            .then(() => {
                                res.redirect("/products/profile/viewProduct");
                            })
                    })

            })
            .catch(err => console.log(`Error with updating data from the database :${err}`));
    }
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
    categoryDBModel.find()
        .then((categories) => {
            const mapCategories = categories.map(cate => {
                return {
                    id: cate._id,
                    categoryName: cate.categoryName,
                    categoryPic: cate.categoryPic
                }
            });
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
                        productShow: mapProduct,
                        categoriesShow: mapCategories
                    });
                })
                .catch(err => console.log(`Error happened when searching product: ${err}`));
        })
        .catch(err => console.log(`Error happened when pulling data from the database :${err}`));
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
                productAvailable: productQuantity > 0,
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
                    itemId: req.params.id,
                    orderedQuantity: req.body.pquan
                }
                if (custOrder.orderedQuantity < product.productQuantity) {
                    message.push("Your product is added to cart. Please check Shopping Cart under Profile ")
                    res.redirect("/profile");
                    registerModel.findById(req.session.user._id)
                        .then((user) => {
                            user.arrayCart.push(custOrder)
                            registerModel.updateOne({ _id: user._id }, {
                                arrayCart: user.arrayCart
                            })
                                .then(() => {
                                    console.log("Add to arrayCart successfully");
                                })
                                .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
                        })
                }
                else {
                    const { _id, productName, productPrice, productDetail, productCategory, productQuantity, productPic } = product;
                    message.push("Sorry! Our current stock is not available ")
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
                        productAvailable: productQuantity > 0,
                        message
                    })
                }
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
    if (req.session.user.type != "Admin") {
        let totalPrice = 0;
        const temp = [];
        let details = {};
        registerModel.findOne({ _id: req.session.user._id })
            .then((user) => {
                productDBModel.find()
                    .then((products) => {
                        user.arrayCart.forEach(item => {
                            products.forEach(product => {
                                if (product._id == item.itemId) {
                                    details = {
                                        id: product._id,
                                        productPrice: product.productPrice,
                                        productName: product.productName,
                                        productPic: product.productPic,
                                        productDetail: product.productDetail,
                                        productQuantity: item.orderedQuantity,
                                    }
                                    totalPrice += (product.productPrice * item.orderedQuantity) + (product.productPrice * item.orderedQuantity) * 0.13;
                                    totalPrice.toFixed(2);
                                    temp.push(details);
                                }
                            })
                        })
                        res.render("products/cart",
                            {
                                title: "Shopping Cart",
                                productShow: temp,
                                totalPrice: totalPrice
                            });
                    })
                    .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
            })
            .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
    }
    else {
        res.redirect("/login");
    }
})

router.post("/profile/shoppingCart", isLogin, (req, res) => {
    let totalPrice = 0;
    const temp = [];
    let details = {};
    registerModel.findOne({ _id: req.session.user._id })
        .then((user) => {
            productDBModel.find()
                .then((products) => {
                    user.arrayCart.forEach(item => {
                        products.forEach(product => {
                            if (product._id == item.itemId) {
                                details = {
                                    id: product._id,
                                    productPrice: product.productPrice,
                                    productName: product.productName,
                                    productPic: product.productPic,
                                    productDetail: product.productDetail,
                                    productQuantity: item.orderedQuantity,
                                }
                                totalPrice += (product.productPrice * item.orderedQuantity) + (product.productPrice * item.orderedQuantity) * 0.13;
                                totalPrice.toFixed(2);
                                temp.push(details);
                            }
                        })
                    })
                    let emailBody = "";
                    emailBody += "Order Sumary:<br><br>"
                        + temp.map(item => { return "Item Name: " + item.productName + "<br>Quantity: " + item.productQuantity })
                        + "\nTotal Price: " + totalPrice + "$<br><br>";

                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                    const msg = {
                        to: `${req.session.user.email}`,
                        from: 'kptustore@gmail.com',
                        subject: `Kptustore's Order onfirmation `,
                        html: `
                                Dear ${req.session.user.firstName} ${req.session.user.lastName},
                                Your KptuStore's order has been confirmed. 
                                ${emailBody}
                                Thank you for shopping with us!
                                `,
                    };

                    sgMail.send(msg)
                        .then(() => {
                            registerModel.updateOne({ _id: req.session.user._id }, {
                                arrayCart: []
                            })
                                .then(() => {
                                    console.log(`Order Confirmation sent`);
                                })
                                .catch(err => {
                                    console.log(`Error happened while sending email ${err}`);
                                });
                            res.render("general/userDashboard",
                                {
                                    title: "Profile",
                                })
                        })
                        .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
                })
                .catch(err => console.log(`Error happened while loading product to cart  :${err}`));
        })
        .catch(err => console.log(`Error happened while loading product to cart  :${err}`));

})

module.exports = router;