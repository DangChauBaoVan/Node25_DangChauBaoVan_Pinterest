const DataTypes = require("sequelize").DataTypes;
const _comments = require("./comments");
const _images = require("./images");
const _save_images = require("./save_images");
const _users = require("./users");

function initModels(sequelize) {
  const comments = _comments(sequelize, DataTypes);
  const images = _images(sequelize, DataTypes);
  const save_images = _save_images(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  comments.belongsTo(images, { as: "image", foreignKey: "image_id"});
  images.hasMany(comments, { as: "comments", foreignKey: "image_id"});
  save_images.belongsTo(images, { as: "image", foreignKey: "image_id"});
  images.hasMany(save_images, { as: "save_images", foreignKey: "image_id"});
  comments.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(comments, { as: "comments", foreignKey: "user_id"});
  images.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(images, { as: "images", foreignKey: "user_id"});
  save_images.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(save_images, { as: "save_images", foreignKey: "user_id"});

  return {
    comments,
    images,
    save_images,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
