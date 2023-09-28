const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    email:{
        required:true,
        type:String
    }, fname:{
    required:true,
        type:String
    }, lname:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
});

const userCollection= mongoose.model("userCollection",userSchema);

module.exports=  userCollection;