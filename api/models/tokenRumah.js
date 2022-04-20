const mongoose = require("mongoose");

const tokenRumah = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idPelanggan: {
    type: Number,
    required: true,
    unique: true,
  },
  namaPemilik: {
    type: String,
    required: true,
  },
  alamatRumah: {
    type: String,
    required: true,
  },
  sisaToken: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("TokenRumah", tokenRumah);
