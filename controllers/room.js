const Room = require("../models/room");
const User = require("../models/user");
const Message = require("../models/message");
const room = require("../models/room");

exports.create = async (req, res) => {
    try {
      
        let room = await Room.findOne({
            group:false,
            users:{"$all":req.body.users}
        }).exec();
        if(room){
            return res.status(200).json({ success: true, room });
        }else{
            let room = await Room.create(req.body);
            return res.status(200).json({ success: true, room });
        }

    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error, message: error.message });
    }
};
exports.findAll = async (req, res) => {
    try {
     
      let userRoom = [];
      
      let user = await User.find({ _id: { $ne: req.auth._id } }).exec();
        user.map(data=>{
            userRoom.push({
                group:false,
                name:data.user_name,
                user_id:data._id,
                image:data.image,
            });
        })
        let rooms = await Room.find({group:true, users:req.auth._id }).select('name image group users').populate('users', 'user_name image').exec();
        if(rooms){
            rooms.map(room=>{
                userRoom.push(room)
            })
        }
      
      return res.status(200).json({ success: true, room:userRoom });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error, message: error.message });
    }
  };

exports.findOne = async (req, res) => {
    try {
        let roomId = req.params.roomId;
        let room = await Room.findById(roomId).populate('users', 'user_name image').exec();
        if(!room.group){
            let user = room.users.find(user=> user._id != req.auth._id);
              if(user){
                  room.name = user.user_name
                  room.image = user.image   
              }
        }
        let message = await Message.find({room:roomId}).select('message user_name message_type updatedAt').exec();
      return res.status(200).json({ success: true, room, message});
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error, message: error.message });
    }
  };


