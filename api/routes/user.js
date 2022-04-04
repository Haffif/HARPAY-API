const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/login", userController.userLogin);
router.post("/registrasi", userController.userSignup);

module.exports = router;
