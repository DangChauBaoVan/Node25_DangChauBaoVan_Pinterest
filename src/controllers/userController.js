const sequelize = require('../models/index');
const init_models = require('../models/init-models');
const model = init_models(sequelize);
const bcrypt = require('bcrypt');
const { sucessCode, failCode, errorCode } = require('../config/response');
const { parseToken } = require('../middlewares/baseToken');
const fs = require('fs');


const register = async (req, res) => {
    try {
        let { full_name, email, password, age } = req.body;
        //mã hóa password
        let passWordHash = bcrypt.hashSync(password, 10);

        let checkEmail = await model.users.findOne({
            where: {
                email
            }
        })

        if (checkEmail) {
            failCode(res, "", "Email đã tồn tại!");
        } else {
            let data = await model.users.create({
                full_name,
                age,
                email,
                password: passWordHash,
            });
            sucessCode(res, data, "Đăng ký thành công !");
        }
    }
    catch (err) {
        errorCode(res, "Lỗi Backend");
    }
}
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let checkLogin = await model.users.findOne({
            where: {
                email
            }
        })

        if (checkLogin) {
            let checkPass = bcrypt.compareSync(password, checkLogin.password);
            //true => khớp
            if (checkPass) {
                let data = { username: checkLogin.email, password: checkLogin.password }
                sucessCode(res, parseToken(data), "Login thành công");
            } else {
                failCode(res, "", "Mật khẩu không đúng !");

            }
        } else {
            failCode(res, "", "Email không đúng !");
        }

    } catch (err) {
        errorCode(res, "Lỗi Backend");
    }
}
const uploadUserAvatar = async (req, res) => {
    try {
        let { email } = req.body;
        let checkUser = await model.users.findOne({
            where: {
                email
            }
        });



        if (req.file.size >= 400000) {
            fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);
            res.send("chỉ được phép upload 4Mb");
            return;
        }
        console.log(req.file.mimetype)
        if (req.file.mimetype != "image/jpeg" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/png") {
            fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);
            res.send("sai định dạng");
        }
        let imageLink
        fs.readFile(process.cwd() + "/public/img/" + req.file.filename, (err, data) => {
            // `"data:${req.file.mimetype};base64,${Buffer.from(data).toString("base64")}"`;

            imageLink = `data:${req.file.mimetype};base64,${Buffer.from(data).toString("base64")}`;
            // lưu database
            //xử lý xóa file
            setTimeout(() => {
                fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);

            }, 5000);
            if (checkUser) {
                model.users.update({
                    avatar: imageLink
                }, {
                    where: {
                        email
                    }
                });

                // res.status(200).send("Update thành công !");
                sucessCode(res, checkUser, "Update thành công");
            } else {
                // res.status(400).send("User không tồn tại");
                failCode(res, email, "User không tồn tại !");
            }
        })


    } catch (error) {
        errorCode(res, "Lỗi Backend");
    }
}
const getUserInfo = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(user_id)
        let data = await model.users.findAll({
            where: {
                user_id
            }
        })
        sucessCode(res, data, "Get User Information Success")
    } catch (error) {
        errorCode(error, "BackEnd Error")
    }
}

const updateUserInfo = async (req, res) => {
    try {
        const { user_id, full_name, age } = req.body;
        let user = await model.users.findOne({
            where: {
                user_id
            }
        })
        if (user) {
            let result = await model.users.update({
                full_name,
                age,
            },
            {where: { user_id}})
            sucessCode(res, result, "Update User Info Success")
        }else{
            failCode(res,"","Can not Update User")
        }

    } catch (error) {
        errorCode(error, "Unknow err")
    }
}

module.exports = {
    register,
    login,
    uploadUserAvatar,
    getUserInfo,
    updateUserInfo
}