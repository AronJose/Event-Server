const events = require('../Controller/eventsController');
const multipleUpload = require('../Helper/multerImageUpload').multipleUpload;
const singleVideoUpload = require('../Helper/multipleVedioUpload').singleVideoUpload;
const verifyToken = require('../Helper/authToken');
const favorite = require('../Controller/favoriteController');

const express = require('express');
const router = express.Router();

router.post('/category', events.addCategory);
router.get('/category', events.categoryList);
router.get('/categoty-id', events.categoryById);
router.post('/service', events.addServices);
router.get('/service', events.getServices);
router.get('/service-id', events.serviceById);
router.post('/addEvent',verifyToken, multipleUpload, events.createEvent);
router.get('/getevents', events.getEventList);
router.put('/delete', events.eventDelete);
router.post('/imgM', multipleUpload, events.multipleImgUpload);
router.get('/search', events.searchEvent);
router.get('/list', events.searchOrGetEventList);
router.post('/providing', events.addProvings);
router.get('/providing', events.getProvidings);
router.post('/provider', events.addProviders);
router.get('/provider', events.getProviders);
router.get('/common', events.getCommonApi);
router.post('/video',singleVideoUpload,events.videoUpload);
router.post('/favorite',verifyToken,favorite.addFavorite);






module.exports = router
