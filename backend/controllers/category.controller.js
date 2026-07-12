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
async function getCategoryById(req, res) {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        res.json(category);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}
async function updateCategory(req, res) {
    try {
        const category = await categoryService.updateCategory(
            req.params.id,
            req.body
        );

        res.json(category);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}
async function deleteCategory(req, res) {
    try {
        await categoryService.deleteCategory(req.params.id);

        res.json({
            message: "Category deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};