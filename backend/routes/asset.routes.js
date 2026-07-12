const express = require("express");

const router = express.Router();

const controller = require("../controllers/asset.controller");

router.post("/", controller.createAsset);

router.get("/", controller.getAssets);

router.get("/:id", controller.getAssetById);

router.put("/:id", controller.updateAsset);

router.delete("/:id", controller.deleteAsset);

module.exports = router;