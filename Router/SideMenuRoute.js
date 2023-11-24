const express = require('express');
const router = express.Router();

const SideMenuController =require('../Controller/SideMenuController')

router.post('/add', SideMenuController.addSidemenu);

// GET request to retrieve all sidemenus
router.get('/sidemenu', SideMenuController.getSidemenus);

// GET request to retrieve a single sidemenu by id
router.get('/sidemenu/:id', SideMenuController.getSidemenuById);

// PUT request to update a sidemenu by id
router.put('/sidemenu/:id', SideMenuController.updateSidemenu);

// DELETE request to delete a sidemenu by id
router.delete('/sidemenu/:id', SideMenuController.deleteSidemenu);

module.exports = router;