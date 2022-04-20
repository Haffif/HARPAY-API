const express = require("express");

const userController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

// router.get("/cehSaldo", checkAuth, userController.userCekSaldo);
router.post("/topup", checkAuth, userController.userTopup);

module.exports = router;
