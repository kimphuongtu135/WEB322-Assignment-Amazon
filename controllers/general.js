const express = require('express')
const router = express.Router()
const registerModel = require("../models/register");
const productModel = require("../models/product");
const categoriesModel = require("../models/categories");
const path = require("path");
const bcrypt = require("bcryptjs");
const isLogin=require("../middleware/auth");
const authorization=require("../middleware/authorization");


router.get("/", (req, res) => {

    res.render("general/home",
        {
            title: "Home",
            categoriesShow: categoriesModel.getAllProduct(),
            bestsellerShow: productModel.getBestSeller(),
        })
});


router.get("/customer", (req, res) => {
    res.render("general/customer",
        {
            title: "Customer Registration"
        })

});

router.get("/login", (req, res) => {
    res.render("general/login",
        {
            title: "Login"
        })

});




router.post("/customer", (req, res) => {

    const errorMessages = [];
    //Check if there is any field that is empty
    if (req.body.yname == "") {
        errorMessages.push({ nameError: "Enter your name" });
    }
    else if (!/[^0-9@$!%*#?&]{2,}$/.test(`${req.body.yname}`)) {
        errorMessages.push({ nameError: "Enter your name with letter only" });
    }

    if (req.body.ylname == "") {
        errorMessages.push({ lnameError: "Enter your name" });
    }
    else if (!/[^0-9@$!%*#?&]{2,}$/.test(`${req.body.ylname}`)) {
        errorMessages.push({ lnameError: "Enter your name with letter only" });
    }


    if (req.body.password == "") {
        errorMessages.push({ passError: "Enter your password" });
    }
    else if (!/^[a-zA-Z0-9]{6,12}$/.test(`${req.body.password}`)) {
        errorMessages.push({ passError: "Enter password between 6 to 12 characters with letter and number only" });
    }

    if (`${req.body.passwordagain}` != `${req.body.password}`) {
        errorMessages.push({ passagainError: "Password is not matching" });
    }

    if (req.body.email == "") {
        errorMessages.push({ emailError: "Enter your email" });
    }

    //THere is an error
    if (errorMessages.length > 0) {
        res.render("general/customer", {
            title: "Customer",
            messages: errorMessages,
            yname: req.body.yname,
            ylname: req.body.ylname,
            email: req.body.email,
            password: req.body.password
        })
    }

    // there is no error
    else {

        registerModel.findOne({ email: req.body.email })

            .then((user) => {

                //there was matching email
                if (user) {
                    errorMessages.push({ emailError: "Sorry! your email has been already used" });
                    res.render("general/customer", {
                        title: "Customer",
                        messages: errorMessages,
                        yname: req.body.yname,
                        ylname: req.body.ylname,
                        email: req.body.email,
                        password: req.body.password
                    })
                }

                else {
                    // No matching email
                    const registerUser = {
                        firstName: req.body.yname,
                        lastName: req.body.ylname,
                        email: req.body.email,
                        password: req.body.password
                    }
                    const register = new registerModel(registerUser);
                    register.save()
                        .then(() => {
                            console.log(`Successfully Register`);
                        })
                        .catch(err => {
                            console.log(`Error occured while inserting data into database ${err}`);
                        });

                    //Sending email when register successfully
                    const { email, yname, ylname } = req.body;
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                    const msg = {
                        to: `${email}`,
                        from: 'kptustore@gmail.com',
                        subject: 'Register Customer Form',
                        html: `
                                Customer name: ${yname} ${ylname},
                                Customer email: ${email}
            `,
                    };

                    sgMail.send(msg)
                        .then(() => {
                            console.log(`Email sent`);
                        })
                        .catch(err => {
                            console.log(`Error happened while sending email ${err}`);
                        });
                    res.render("general/dashboard", {
                        title: "Dashboard",
                        message: `${req.body.email}`
                    })
                }
            })
            .catch(err => console.log(`Error happned while finding matching email ${err}`));
    }


});

router.post("/login", (req, res) => {

    const errorMessages = [];
    //Checking email and password are empty
    if (req.body.email == "") {
        errorMessages.push({ emailError: "Enter your email" });
    }

    if (req.body.password == "") {
        errorMessages.push({ passError: "Enter your password" });
    }


    //There is an error
    if (errorMessages.length > 0) {
        res.render("general/login", {
            title: "Login",
            messages: errorMessages,
            email: req.body.email,
            password: req.body.password

        })
    }

    // there is no error
    else {

        registerModel.findOne({ email: req.body.email })

            .then((user) => {

                //there was no matching email
                //Cannot find user
                if (user == null) {
                    errorMessages.push({ emailError: "You enter wrong email" });
                    res.render("general/login", {
                        title: "Login",
                        messages: errorMessages,
                        email: req.body.email,
                        password: req.body.password
                    })

                }
                //Email matching
                // User is found
                else {
                    bcrypt.compare(req.body.password, user.password)
                        .then((isCorrect) => {

                            //password match
                            //Login successfully
                            if (isCorrect) {
                                req.session.user = user;
                                //authorization(req,res);
                                res.redirect("/profile");
                            }
                            //password doesn't match
                            else {
                                errorMessages.push({ passError: "Your password is incorrect" });
                                res.render("general/login", {
                                    title: "Login",
                                    messages: errorMessages,
                                    email: req.body.email,
                                    password: req.body.password
                                })
                            }
                        })
                        .catch(err => console.log(`Error happened while verifying password ${err}`));

                }
            })
            .catch(err => console.log(`Error happened while verifying email ${err}`));
    }

});
router.get("/profile",isLogin,authorization); 

/*router.get("/admin-profile",isLogin,(req, res) => {
   
    res.render("general/adminDashboard",
        {
            title: "Admin",

        })

});*/

router.get("/logout",(req,res)=>{

    req.session.destroy();
    res.redirect("/login")
});

module.exports = router;