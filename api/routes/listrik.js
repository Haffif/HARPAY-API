const express = require("express");

const listrikController = require("../controllers/listrik");

const router = express.Router();

// == this just for add data to db!
router.get("/listrikRumah", listrikController.getListrikRumah);
router.post("/listrikRumah", listrikController.createListrikRumah);
router.get("/tokenRumah", listrikController.getTokenRumah);
router.post("/tokenRumah", listrikController.createTokenRumah);

module.exports = router;
