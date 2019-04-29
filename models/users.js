const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  googleId: String
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
