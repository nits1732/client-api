//define the database
const mongoose=require('mongoose');
const Schema=mongoose.Schema

const UserSchema=new Schema({
    name:{
        type: String,
        maxlength:50,
        required:true
    },
    phone:{
        type: Number,
        maxlength:11,
    },
    address:{
        type: String,
        maxlength:100,
    },
    company:{
        type: String,
        maxlength:50,
        required:true
    },
    email:{
        type: String,
        maxlength:50,
        required:true
    },
    password:{
        type: String,
        minlength:8,
        maxlength:100,
        required:true
    },
    refreshJWT:{
        token:{
            type :String,
            maxlength:500,
            default:"",
        },
        addedAt:{
            type: Date,
            required:true,
            default:Date.now()
        }
    }
})

module.exports={
    UserSchema : mongoose.model("User",UserSchema),
    //this is a model of user collection in mongodb
}