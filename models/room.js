const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const roomSchema = new Schema(
  {
    name: String,
    image:String,
    users:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    group:{type:Boolean, default:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
