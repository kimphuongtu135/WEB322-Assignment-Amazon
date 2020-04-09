const authorization= (req,res)=>{

    if(req.session.user.type=="Admin")
    {
        res.render("general/adminDashboard",
        {
            title: "Admin",

        })

    }
    else
    {
        res.render("general/userDashboard",
        {
            title: "Profile",

        })

    }

}
module.exports=authorization;