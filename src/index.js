//yarn add express
const express = require('express');
const app = express();
//middleware chuyển đổi data json từ FE xuống express
app.use(express.json());
app.use(express.static(".")); // định nghĩa lại url để sử dụng tài nguyên

const cors = require('cors');
app.use(cors());
//domain
app.listen(8080)
console.log("connect success")


const rootRoute = require('./routes');

app.use("/api",rootRoute)