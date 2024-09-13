const events = require('../Controller/eventsController');
const multipleUpload = require('../Helper/multerImageUpload').multipleUpload;
const express = require('express');
const router = express.Router();

router.post('/category', events.addCategory);
router.get('/category', events.categoryList);
router.get('/categoty-id', events.categoryById);
router.post('/service', events.addServices);
router.get('/service', events.getServices);
router.get('/service-id', events.serviceById);
router.post('/addEvent', multipleUpload, events.createEvent);
router.get('/getevents', events.getEventList);
router.put('/delete', events.eventDelete);
router.post('/imgM', multipleUpload, events.multipleImgUpload);
router.get('/search', events.searchEvent);
router.get('/list', events.searchOrGetEventList);


module.exports = router
