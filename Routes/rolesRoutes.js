const rolesController = require('../Controller/rolesController');
const express = require('express');
const router = express.Router();

router.post('/', rolesController.addRoles);
router.get('/', rolesController.getRoles);
router.get('/role',rolesController.RoleById);


module.exports = router
