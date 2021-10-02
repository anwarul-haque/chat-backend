const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new Schema(
  {
    name: String,
    image:String,
    user_name: {
      type: String,
      required: true,
      unique:true
    },

    salt: String,
    encry_password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .get(function () {
    return this._password;
  })
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  });

userSchema.methods = {
  authenticate: function (planepassword) {
    return this.securePassword(planepassword) === this.encry_password;
  },

  securePassword: function (planepassword) {
    if (!planepassword) return "";

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(planepassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
