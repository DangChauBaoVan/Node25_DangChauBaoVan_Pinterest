const express = require('express');

const { register, login, uploadUserAvatar, getUserInfo, updateUserInfo } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/baseToken');
const { upload } = require('../middlewares/upload');
const userRoute = express.Router();

userRoute.post("/register", register);

userRoute.get("/login", login);

userRoute.post("/uploadUserAvatar",verifyToken,upload.single("dataUpload"),uploadUserAvatar)

userRoute.get("/getUserInfo/:user_id",verifyToken,getUserInfo)



userRoute.put("/updateUserInfo",verifyToken,updateUserInfo)

module.exports = userRoute;