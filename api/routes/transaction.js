const express = require("express");

const userController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.get("/cekSaldo", checkAuth, userController.userGetSaldo);
router.post("/topup", checkAuth, userController.userTopup);
router.post("/cekPembayaranListrik", checkAuth, userController.userCekBayarListrik);
router.post("/pembayaranListrik", checkAuth, userController.userBayarListrik);

module.exports = router;
