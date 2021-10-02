const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongoose = require("mongoose");

//Route import
const user = require("./routes/user");
const Message = require("./models/message");


require("dotenv").config();

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// Using middle ware
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(express.json({ limit: "50mb" }));

io.on('connection', (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on('join_room', room=>{
    socket.join(room);
    io.emit('join_room', room);
  });

  socket.on('chat', async(message) => {

    try {

      let msg = await Message.create(message);

      let storedMsg ={ 
        message:msg.message,
        user_name:msg.user_name,
        message_type:msg.message_type,
        updatedAt:msg.updatedAt
      }

      io.to(message.room).emit('chat', storedMsg);
      
    } catch (error) {
      console.log(error);
    }

  });

  socket.on('typing', (message) => {
    io.emit('typing', message);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});

app.use("/user", user);

let port = process.env.PORT || 4000;
http.listen(port, async () => {
  console.log(`server running on http://localhost:${port}`);

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log(`DB Connection success:${port}`);
  } catch (error) {
    handleError(error);
  }
});
