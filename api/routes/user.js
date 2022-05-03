const express = require("express");

const userController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/login", userController.userLogin);
router.post("/registrasi", userController.userSignup);
router.post("/updatePin", checkAuth, userController.userUpdatePin);
router.post("/updatePassword", checkAuth, userController.userUpdatePassword);
router.post("/lupaPassword", userController.userSendForgotPassword);
router.post("/konfirmasiLupaPassword", userController.userConfirmForgotPassword);

module.exports = router;
