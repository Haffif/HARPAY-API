const mongoose = require("mongoose");

const rumahListrik = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    
  },
});

module.exports = mongoose.model("RumahListrik", rumahListrik);
