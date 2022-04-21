const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: String,
    required: true
  },
  userNama: {
    type: String,
    required: true,
  },
  jenisTransaksi: {
    type: String,
    required: true,
  },
  jumlahTopup: {
    type: Number,
    required: true
  },
  nominalPengeluaran: {
    type: Number,
    required: true
  },
  idPelanggan: {
    type: String,
    required: true
  },
  akunTujuanTransfer: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("History", historySchema);
