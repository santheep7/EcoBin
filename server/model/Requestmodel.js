const mongoose = require('mongoose')
const User = require('./Usermodel')

const requestSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User_tbl',
        required:true
    },
    ewasteType:{type:String,required:true},
    quantity:{type:String,required:true,default:1},
    pickupDate:{type:Date,required:true},
    timeSlot:{type:String,required:true},
    notes:{type:String},
    image:{type:String},
    status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'cancelled'] },
  isPickedUp: { type: Boolean, default: false },
  latitude: { type: Number, required: true },
longitude: { type: Number, required: true },

},{timestamps:true});

const Request = mongoose.model('Request_tbl',requestSchema);
module.exports = Request;