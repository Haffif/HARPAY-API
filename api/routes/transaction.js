const express = require("express");

const userController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/cekSaldo", checkAuth, userController.userGetSaldo);
router.post("/topup", checkAuth, userController.userTopup);
router.post("/cekPembayaranListrik", checkAuth, userController.userCekBayarListrik);
router.post("/pembayaranListrik", checkAuth, userController.userBayarListrik);
router.post("/cekTokenListrik", checkAuth, userController.userCekToken);
router.post("/pembelianTokenListrik", checkAuth, userController.userBeliToken);
router.post("/transferSaldo", checkAuth, userController.userTransfer);
router.get("/cekHistory", checkAuth, userController.userCekHistory);

module.exports = router;
