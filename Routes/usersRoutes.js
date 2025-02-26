const users = require('../Controller/usersController');
const verifyToken = require('../Helper/authToken');
const singleUpload=require('../Helper/multerImageUpload').singleUpload;
const express = require('express');
const router = express.Router();

router.post('/signup',singleUpload,users.addUser);
router.get('/list', users.getUsers);
router.post('/login',users.login);
router.post('/logout',verifyToken,users.logout);
router.post('/profileImage',singleUpload,users.imgUpload);
router.get('/profile',verifyToken,users.profile);
router.put('/update',verifyToken,users.updateProfile);




module.exports = router
