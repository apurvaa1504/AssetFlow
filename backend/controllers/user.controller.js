const userService = require("../services/user.service");

const VALID_ROLES = ["admin", "asset_manager", "department_head", "employee"];

async function getUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

async function promoteUser(req, res) {
    try {
        const { role } = req.body;

        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(", ")}` });
        }

        const updatedUser = await userService.updateUserRole(req.params.id, role);
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

module.exports = {
    getUsers,
    promoteUser,
};