const linkService = require('../services/link.service');

const addLink = async (req, res, next) => {
    try {
        const {title, url} = req.body;
        //ID user diambil dari req.user yang sudah diisi oleh middleware protectRoute
        const userId = req.user.id;

        if (!title||!url) {
            return res.status(400).json({message: "URL is required"});
        }

        const newLink = await linkService.createlink({title, url, userId});
        return res.status(201).json({message: "Link created successfully", data: newLink});
    }
    catch (error) {
        next(error);
    }
};

const getAllLinks = async (req,res, next) => {
    try {
        const userId = req.user.id;
        const links = await linkService.getLinksByUserId(userId);
        res.status(200).json({message: "Links retrieved successfully", data: links});
    }
    catch (error) {
        next(error);
    }
};

const updateLink = async (req, res, next) => {
    try {
        const { id } = req.params; // Ambil ID link dari parameter URL
        const { title, url } = req.body;
        const userId = req.user.id;
    
        // Validasi: pastikan title atau url ada
        if (!title && !url) {
            return res.status(400).json({message: "Title or URL is required to update"});
        }

        const updateLink = await linkService.updateLinkById(id, userId, {title, url});
        res.status(200).json({message: "Link updated successfully", data: updateLink});
    }
    catch (error) {
        next(error);
    }
    
}

const deleteLink = async (req, res, next) => {
    try {
        const { id } = req.params; // Ambil ID link dari parameter URL
        const userId = req.user.id;

        await linkService.deleteLinkById(id, userId);

        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    addLink,
    getAllLinks,
    updateLink,
    deleteLink,
}