const mongoose = require('mongoose')    
const bcrypt = require('bcrypt');

const UserSchema =new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Please enter your name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please enter email'],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Please enter the password'],
        minLength:8,
        
    },
    isAdmin:{
        type:Boolean,
        default:false
    }



},{timestamps:true})


UserSchema.pre(
    'save',
    async function(next){
        const user = this;
        const hash = await bcrypt.hash(this.password,10)
        this.password = hash
        next()
    }
)

UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password,user.password)
    return compare
}

module.exports = mongoose.model('User',UserSchema);