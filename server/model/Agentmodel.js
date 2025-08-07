const mongoose = require('mongoose')

const agentSchema = mongoose.Schema({
    agentname:{type:String,required:true},
    adharid:{type:Number,required:true},
    email:{type:String,required:true},
    phone:{type:Number,required:true},
    place: { type: String, required: true },
    password:{type:String,required:true},
    isApproved:{type:Boolean,default:false},
    
},{timestamps:true})

const Agent = mongoose.model("Agent",agentSchema)
module.exports = Agent