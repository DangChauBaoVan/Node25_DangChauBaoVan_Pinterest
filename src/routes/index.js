const express = require('express');
const imageRoute = require('./imageRoute');
const userRoute = require('./userRoute');
const rootRoute = express.Router();

rootRoute.use("/user", userRoute);
rootRoute.use("/image", imageRoute);

module.exports = rootRoute;


