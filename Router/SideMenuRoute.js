const express = require('express');
const router = express.Router();


//fixed Data

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



// content Data:


const SideMenucontentController =require('../Controller/SideMenuContentController')

router.post('/addcontent', SideMenucontentController.addSidemenu);

// GET request to retrieve all sidemenus
router.get('/sidemenucontent', SideMenucontentController.getSidemenus);

// GET request to retrieve a single sidemenu by id
router.get('/sidemenucontent/:id', SideMenucontentController.getSidemenuById);

// PUT request to update a sidemenu by id
router.put('/sidemenucontent/:id', SideMenucontentController.updateSidemenu);

// DELETE request to delete a sidemenu by id
router.delete('/sidemenucontent/:id', SideMenucontentController.deleteSidemenu);

module.exports = router;