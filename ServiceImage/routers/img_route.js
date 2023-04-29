const express = require('express');
const router = express.Router();
const linkController = require('../controllers/img_controller.js');

// Route to create a new link
router.post('/links', linkController.create);

// Route to get all links
router.get('/links', linkController.getAll);

// Route to get picture compressed
router.get('/compressed/:name', linkController.getPictureCompressed);

// Route to get picture thumbnails
router.get('/thumbnails/:name', linkController.getPictureThumbnails);

router.delete('/links', linkController.deleteAll);

router.delete('/links/:name', linkController.deleteByName);



module.exports = router;

//http://localhost:3000/compressed/Music_Icon.jpg