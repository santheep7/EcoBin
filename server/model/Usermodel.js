const mongoose = require('mongoose')
const { type } = require('express')

const userSchema = mongoose.Schema({
    name:{type:String},
    phone:{type:String},
    place:{type:String},
    address:{type:String},
    email:{type:String},
    password:{type:String}   
},{timestamps:true})
const User = mongoose.model("User_tbl",userSchema)

module.exports = User