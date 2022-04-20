const mongoose = require("mongoose");

const listrikRumah = mongoose.Schema({
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
  pembayaranBulan: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("ListrikRumah", listrikRumah);
