const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const messageSchema = new Schema(
  {
    room:{ type: Schema.Types.ObjectId, ref: 'Room' },
    user:{ type: Schema.Types.ObjectId, ref: 'User' },
    message:String,
    user_name:String,
    message_type:{
      type: String,
      enum: ['message','image' , 'doc'],
      default:'message'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
