console.log("Category routes loaded");
const express = require("express");

const router = express.Router();

const controller = require("../controllers/category.controller");

// router.post("/", controller.createCategory);
router.post("/", (req, res, next) => {
    console.log("POST /categories hit");
    next();
}, controller.createCategory);
router.get("/", controller.getCategories);

module.exports = router;