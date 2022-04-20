const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, // email validation regex
  },
  noTelp: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  saldo: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
