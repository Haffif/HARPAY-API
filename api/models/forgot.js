const mongoose = require("mongoose");

const forgotPassSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, // email validation regex
  },
  pin: {
    type: Number,
    required: true
  },
  expired: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("Forgot", forgotPassSchema);
