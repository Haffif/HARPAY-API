const express = require("express");

const userController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/login", userController.userLogin);
router.post("/registrasi", userController.userSignup);
router.post("/updatePin", checkAuth, userController.userUpdatePin);

module.exports = router;
