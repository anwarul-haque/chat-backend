const User = require("../models/user");
const Room = require("../models/room");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var expressJwt = require("express-jwt");

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.login = async (req, res) => {
  try {
    let { user_name, password } = req.body;
    let user = await User.findOne({ user_name }).exec();
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid User name" });
    }
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: 60 * 60 * 8,
    });

    user.encry_password = undefined;
    user.salt = undefined;

    return res.json({
      success: true,
      token,
      user: user,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error, message: "User email does not exists" });
  }
};
exports.signUp = async (req, res) => {
  try {
    let userExist = await User.findOne({user_name:req.body.user_name}).exec();
    if(userExist){
      return res.status(400).json({ success: true, error:'User name allready exist.' });
    }else{
      let user = await User.create(req.body);
      return res.status(200).json({ success: true, user });
          
    }
   
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error, message: error.message });
  }
};
exports.findAll = async (req, res) => {
  try {
    let user = await User.find({ _id: { $ne: req.auth._id } }).exec();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error, message: error.message });
  }
};
