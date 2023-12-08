const express = require('express');
const router = express.Router();

const DetailsController =require('../Controller/DetailsController')


// text1, text2, number, displayK

router.post('/add', DetailsController.adddetails);

// GET request to retrieve all Detailss
router.get('/details', DetailsController.getdetailss);

// GET request to retrieve a single Details by id
router.get('/details/:id', DetailsController.getdetailsById);

// PUT request to update a Details by id
router.put('/details/:id', DetailsController.updatedetails);

// DELETE request to delete a Details by id
router.delete('/details/:id', DetailsController.deletedetails);




const DetailsBlogController =require('../Controller/DetailsBlogController')


// text1, text2, number, displayK

router.post('/addblog', DetailsBlogController.adddetails);

// GET request to retrieve all Detailss
router.get('/blogs', DetailsBlogController.getdetailss);

// GET request to retrieve a single Details by id
router.get('/blogs/:id', DetailsBlogController.getdetailsById);

// PUT request to update a Details by id
router.put('/blogs/:id', DetailsBlogController.updatedetails);

// DELETE request to delete a Details by id
router.delete('/blogs/:id', DetailsBlogController.deletedetails);







module.exports = router;