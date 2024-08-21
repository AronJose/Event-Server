const events = require('../Controller/eventsController');
const multipleUpload = require('../Helper/multerImageUpload').multipleUpload;
const express = require('express');
const router = express.Router();

router.post('/category', events.addCategory);
router.get('/category', events.categoryList);
router.post('/service', events.addServices);
router.get('/service', events.getServices);
router.post('/addEvent', events.createEvent);
router.post('/imgM', multipleUpload, events.multipleImgUpload);
router.get('/search', events.searchEvent);

module.exports = router
