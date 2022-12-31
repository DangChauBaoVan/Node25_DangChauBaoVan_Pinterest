const sequelize = require('../models/index');
const init_models = require('../models/init-models');
const model = init_models(sequelize);

const { sucessCode, failCode, errorCode } = require('../config/response');
const fs = require('fs');

const postImage = async (req, res) => {
    try {
        let { user_id } = req.params;
        let { image_name, description } = req.body;
        let checkUser = await model.users.findOne({
            where: {
                user_id
            }
        })

        if (req.file.size >= 1500000) {
            fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);
            res.send("chỉ được phép upload 15Mb tối đa");
            return;
        }

        if (req.file.mimetype != "image/jpeg" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/png") {
            fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);
            res.send("sai định dạng");
        }
        if (checkUser) {

            fs.readFile(process.cwd() + "/public/img/" + req.file.filename, (err, data) => {

                let image_path = `data:${req.file.mimetype};base64,${Buffer.from(data).toString("base64")}`;

                setTimeout(() => {
                    fs.unlinkSync(process.cwd() + "/public/img/" + req.file.filename);

                }, 5000);

                let imageData = model.images.create({
                    image_name,
                    description,
                    image_path,
                    user_id
                });
                sucessCode(res, imageData, "Upload thành công");
            })


        } else {
            // res.status(400).send("User không tồn tại");
            failCode(res, email, "User không tồn tại !");
        }

    } catch (error) {
        errorCode(res, "Lỗi Backend");
    }
}
const getAllImage = async (req, res) => {
    try {
        let data = await model.images.findAll();
        sucessCode(res, data, "Get Data Success")
    } catch (error) {
        errorCode(res, "Unknow err")
    }
}
const searchImageByName = async (req, res) => {
    try {
        const { image_name } = req.body
        let data = await model.images.findAll({
            where: {
                image_name
            }
        });
        sucessCode(res, data, "Get Data Success")
    } catch (error) {
        errorCode(res, "Unknow err")
    }
}
const getImageDetail = async (req, res) => {
    try {
        const { image_id } = req.params
        let data = await model.images.findAll({
            include: ["user"],
            where: {
                image_id
            }
        })
        sucessCode(res, data, "Get Image Success")
    } catch (error) {
        errorCode(res, "Unknow err")
    }
}
const getComentByImageID = async (req, res) => {
    try {
        const { image_id } = req.params
        let data = await model.comments.findAll({
            where: {
                image_id
            }
        })
        sucessCode(res, data, "Get Image Success")
    } catch (error) {
        errorCode(res, "Unknow err")
    }
}
const checkSaveImage = async (req, res) => {
    try {
        const { image_id } = req.params
        const { user_id } = req.body
        let data = await model.save_images.findAll({
            where: {
                image_id,
                user_id
            }
        })

        if (data.length > 0) {
            sucessCode(res, true, "Image Saved")
        } else {
            failCode(res, false, "Image Not Saved")
        }

    } catch (error) {
        errorCode(res, "Unknow err")
    }
}
const commentImage = async (req, res) => {
    try {
        const { user_id, image_id, comments_text } = req.body
        let result = await model.comments.create({
            user_id,
            image_id,
            comments_text
        })
        sucessCode(res, result, "Comment Success")
    } catch (error) {
        errorCode(error, "Unknow err")
    }
}

const deleteImageByID = async (req, res) => {
    try {
        const { image_id } = req.params
        await model.comments.destroy({
            where: {
                image_id
            }
        })
        await model.save_images.destroy({
            where: {
                image_id
            }
        })
        let result = await model.images.destroy({
            where: {
                image_id
            }
        })

        sucessCode(res, result, "Delete Image Success")
    } catch (error) {
        errorCode(error, "Unknow err")
    }
}

const getSavedImageByUserID = async (req, res) => {
    try {
        const { user_id } = req.params
        let data = await model.save_images.findAll({
            include: ["image"],
            where: {
                user_id
            }

        })
        sucessCode(res, data, "Get Image Saved By User ID Success")
    } catch (error) {
        console.log(error);
        errorCode(error, "Unknow err")
    }
}

const getImageCreateByUser = async (req, res) => {
    try {
        const { user_id } = req.params
        let data = await model.images.findAll({

            where: {
                user_id
            }

        })
        sucessCode(res, data, "Get Create Image By User ID Success")
    } catch (error) {
        errorCode(error, "Unknow err")
    }
}

module.exports = {
    postImage,
    getAllImage,
    searchImageByName,
    getImageDetail,
    getComentByImageID,
    checkSaveImage,
    commentImage,
    deleteImageByID,
    getSavedImageByUserID,
    getImageCreateByUser,
}