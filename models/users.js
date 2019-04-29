const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  user_id:[String],
  favorites: [String]
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
