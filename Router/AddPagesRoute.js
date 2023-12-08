const express = require('express');
const router = express.Router();

const AddPagesController =require('../Controller/AddPagesController')


// text1, text2, number, displayK

router.post('/addpage', AddPagesController.adddetails);

// GET request to retrieve all Detailss
router.get('/pages', AddPagesController.getdetailss);

// GET request to retrieve a single Details by id
router.get('/pages/:id', AddPagesController.getdetailsById);

// PUT request to update a Details by id
router.put('/pages/:id', AddPagesController.updatedetails);

// DELETE request to delete a Details by id
router.delete('/pages/:id', AddPagesController.deletedetails);



module.exports = router;