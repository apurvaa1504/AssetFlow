const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

// GET /users - Employee Directory (Admin only)
router.get("/", requireAuth, requireRole("admin"), controller.getUsers);

// PATCH /users/:id/role - Promote a user (Admin only)
router.patch("/:id/role", requireAuth, requireRole("admin"), controller.promoteUser);

module.exports = router;