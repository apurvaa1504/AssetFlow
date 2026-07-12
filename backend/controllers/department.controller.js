const departmentService = require("../services/department.service");

async function createDepartment(req, res) {
    try {
        const department = await departmentService.createDepartment(req.body);
        res.status(201).json(department);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

async function getDepartments(req, res) {
    try {
        const departments = await departmentService.getAllDepartments();
        res.json(departments);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

async function updateDepartment(req, res) {
    try {
        const department = await departmentService.updateDepartment(req.params.id, req.body);
        res.json(department);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

module.exports = {
    createDepartment,
    getDepartments,
    updateDepartment,
};