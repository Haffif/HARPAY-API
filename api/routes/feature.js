const express = require("express");

const featureController = require("../controllers/feature");

const router = express.Router();

router.get("/", featureController.getAllFeature);
router.get("/:featureId", featureController.getSpecificFeature);
router.post("/", featureController.featuresAddFeature);

module.exports = router;
