const express = require("express");
const router = express.Router();
const controller = require("../controllers/department.controller");

router.post("/", controller.createDepartment);
router.get("/", controller.getDepartments);
router.patch("/:id", controller.updateDepartment);

module.exports = router;