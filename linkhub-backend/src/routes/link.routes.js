const express = require('express');
const router = express.Router();
const linkController = require('../controllers/link.controller');
const { protectRoute } = require('../middleware/auth.middleware');

//Terapkan middleware protectRoute untuk semua route di file ini
router.use(protectRoute);

//Route untuk membuat link baru
router.post('/', linkController.addLink);
//Route untuk mendapatkan semua link milik user yang sedang login
router.get('/', linkController.getAllLinks);

router.patch('/:id', linkController.updateLink);
router.delete('/:id', linkController.deleteLink);

module.exports = router;