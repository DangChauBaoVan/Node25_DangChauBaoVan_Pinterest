const express = require('express');
const { postImage, getAllImage, searchImageByName, getImageDetail, getComentByImageID, checkSaveImage, commentImage, deleteImageByID, getSavedImageByUserID, getImageCreateByUser } = require('../controllers/imageController');
const { verifyToken } = require('../middlewares/baseToken');
const { upload } = require('../middlewares/upload');
const imageRoute = express.Router();


imageRoute.post("/postImage/:user_id",verifyToken,upload.single("image"),postImage);

imageRoute.get("/getAllImages",getAllImage)

imageRoute.get("/searchImage",searchImageByName)

imageRoute.get("/imageDetail/:image_id",getImageDetail)

imageRoute.get("/imageComments/:image_id",getComentByImageID)

imageRoute.get("/checkSavedImage/:image_id",verifyToken,checkSaveImage)

imageRoute.post("/commentsImage",verifyToken,commentImage)

imageRoute.delete("/deleteImage/:image_id",verifyToken,deleteImageByID)

userRoute.get("/getSavedImage/:user_id",verifyToken,getSavedImageByUserID)

userRoute.get("/getCreateImage/:user_id",verifyToken,getImageCreateByUser)
module.exports = imageRoute;