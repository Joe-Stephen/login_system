const adminCollection=require("../models/adminSchema");
const userCollection=require("../models/userSchema");


//session existence checking while admin access
module.exports.getAdminRoute=async(req,res)=>{
    if(req.session.admin){
        users=await userCollection.find({});
        res.render("adminDashboard",{users});
    }else{
        res.render("adminLogin");
    }
};
//admin authentication
module.exports.postAdminRoute=async (req,res)=>{
    const data= await adminCollection.findOne({email: req.body.email});
    const users= await userCollection.find({});
    if (data){
        if(req.body.email !== data.email && req.body.password){
            res.redirect("/admin");
        }else if(
            req.body.email===data.email&&
            req.body.password!==data.password
            ){
                res.redirect("/admin");
            }else{
                if(
                    req.body.email===data.email&&
                    req.body.password=== data.password
                ){
                    req.session.admin=req.body.email;
                    res.render("adminDashboard",{users});
                }
            }
            }else {
                res.redirect("/");
            }
    };

    //user search
    module.exports.postSearchUser=async (req,res)=>{
        const name=req.body.search;
        console.log(name);
        const regex= new RegExp(`^${name}`,"i");
        const users= await userCollection.find({email:{$regex:regex}}).exec();
        console.log(users)
        res.render("adminDashboard",{users});
    };

    //user udate
    module.exports.getUpdateUser=async (req,res)=>{
        const id=req.query.id;
        const data= await userCollection.find({_id:id});
        user=data[0];
        res.render("updateUser",{user});
    };

    //saving updated user details 
    module.exports.postUpdateUser=async (req,res)=>{
        const id=req.query.id;
        const data= await userCollection.updateOne(
            {_id:id},
            {
                $set:{
                    email: req.body.email,
                    fname: req.body.email,
                    lname: req.body.lname,
                    password: req.body.password,
                },
            }
        );
        const users= await userCollection.find({});
        res.render("adminDashboard", {users});
    };

    //user deletion
    module.exports.getDeleteUser = async (req,res)=>{
        const id= req.query.id;
        const data= await userCollection.deleteOne({_id:id});
        const users= await userCollection.find({});
        res.render("adminDashboard",{users});
    };

    //user sign-up
    module.exports.getNewUser=(req,res)=>{
        req.session.admin=null;
            res.redirect("/user/signup");
        

    };

    //adding new user to list
    module.exports.postNewUser=(req,res)=>{
        res.render("adminDashboard");
    };    

    //admin logout
    module.exports.getLogout = (req, res) => {
        req.session.admin = null;
        res.redirect("/");
      };
    
    //session handling
    module.exports.getAdminDashboard =async (req, res) => {
        const users= await userCollection.find({});
        // res.render("adminDashboard",{users});
        if (req.session.admin) {
          res.render("adminDashboard",{users});
        }else{
            res.redirect("/")
        }
      };