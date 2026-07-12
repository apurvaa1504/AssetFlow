const categoryService = require("../services/category.service");

async function createCategory(req, res) {
    try {
        const category = await categoryService.createCategory(req.body);

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

async function getCategories(req, res) {
    try {
        const categories = await categoryService.getAllCategories();

        res.json(categories);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

module.exports = {
    createCategory,
    getCategories,
};