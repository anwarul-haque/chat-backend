
const Message = require("../models/message");

exports.findByRoom = async (req, res) => {
    try {
        let roomId = req.body.roomId;
        let message = await Message.find({room:roomId}).exec(); 
        return res.status(200).json({ success: true, message });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error, message: error.message });
    }
};