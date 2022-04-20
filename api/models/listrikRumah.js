const mongoose = require("mongoose");

const listrikRumah = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
  },
  jumlahBayarBulan: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("ListrikRumah", listrikRumah);
