require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true },
    aadharNum: {
      type: Number,
      required: true,
      unique: true,
      maxLength: [12, "max length is 12"],
    },
    mobileNum: {
      type: Number,
      required: true,
      maxLength: 10,
      minLength: 10,
      unique: true,
    },
    panNum:{
        type: String,
        required:true,
        unique:true
    },
    address:{
      type: String,
      required:true,

  },
    password: { type: String },
    gender: {
      type: String,
      required: true,
    },
    salary: {
        type: Number,
        required: true,
  },
  isKyc:{
    type: Boolean,
    default:false

  }
},
  { timestamps: true }

);

const User = new mongoose.model("User", UserSchema);
module.exports = User;
