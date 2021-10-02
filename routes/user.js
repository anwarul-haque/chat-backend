const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const room = require("../controllers/room");
const message = require("../controllers/message");

router.post("/login", user.login);

router.post("/signup", user.signUp);

router.get("/all", user.isSignedIn, user.findAll);

router.post("/room", user.isSignedIn, room.create);

// router.post("/room", user.isSignedIn, room.f);
router.get("/room", user.isSignedIn, room.findAll);

router.get("/room/:roomId", user.isSignedIn, room.findOne);

router.get("/message/roomId:", user.isSignedIn, message.findByRoom);

module.exports = router;
