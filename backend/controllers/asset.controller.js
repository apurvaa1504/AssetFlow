const assetService = require("../services/asset.service");

// Create
async function createAsset(req, res) {
    try {
        const asset = await assetService.createAsset(req.body);

        res.status(201).json(asset);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

// Get All
async function getAssets(req, res) {
    try {
        const assets = await assetService.getAssets(req.query);

        res.json(assets);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

// Get By ID
async function getAssetById(req, res) {
    try {
        const asset = await assetService.getAssetById(req.params.id);

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found",
            });
        }

        res.json(asset);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

// Update
async function updateAsset(req, res) {
    try {
        const asset = await assetService.updateAsset(
            req.params.id,
            req.body
        );

        res.json(asset);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

async function updateAssetStatus(req, res) {
    try {
        const asset = await assetService.updateAssetStatus(
            req.params.id,
            req.body.status
        );

        res.json(asset);

    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

// Delete
async function deleteAsset(req, res) {
    try {
        await assetService.deleteAsset(req.params.id);

        res.json({
            message: "Asset deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
}

module.exports = {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    updateAssetStatus,
};