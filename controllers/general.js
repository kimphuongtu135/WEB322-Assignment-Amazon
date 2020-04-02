const express = require('express')
const router = express.Router()


const productModel = require("../models/product");
const categoriesModel = require("../models/categories");

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


router.post("/login", (req, res) => {
    const errorMessages = [];

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
        res.render("general/login", {
            title: "Login",
            message: `Login Success`
        })
    }


});

router.post("/customer", (req, res) => {
   
    const errorMessages = [];

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

    if (req.body.email == "") {
        errorMessages.push({ emailError: "Enter your email" });
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
        const {email,yname,ylname}=req.body;
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
            to: `${email}`,
            from: 'kptustore@gmail.com',
            subject: 'Register Customer Form',
            html:`
            Customer name: ${yname} ${ylname},
            Customer email: ${email}
            `,
        };
        
        sgMail.send(msg)
        .then(()=>{
            console.log(`Email sent`);
        })
        .catch(err=>{
            console.log(`Err ${err}`);
        });
        res.render("general/dashboard", {
            title: "Dashboard",
            message: `${req.body.email}`
        })
    }


});


module.exports = router;