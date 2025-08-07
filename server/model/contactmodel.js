const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true},
},{timestamps:true})

const message = mongoose.model("message",ContactSchema)
module.exports = message