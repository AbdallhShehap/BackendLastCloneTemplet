const express = require('express');
const router = express.Router();

const DetailsController =require('../Controller/FooterFexedController')


// fixed data :


router.post('/add', DetailsController.adddetails);

// GET request to retrieve all Detailss
router.get('/details', DetailsController.getdetailss);

// GET request to retrieve a single Details by id
router.get('/details/:id', DetailsController.getdetailsById);

// PUT request to update a Details by id
router.put('/details/:id', DetailsController.updatedetails);

// DELETE request to delete a Details by id
router.delete('/details/:id', DetailsController.deletedetails);




// first section data : 

const FooterFirstContentController =require('../Controller/FooterFirstContentController')

router.post('/addfirstsectioncontent', FooterFirstContentController.adddetails);

// GET request to retrieve all Detailss
router.get('/detailsfirstsectioncontent', FooterFirstContentController.getdetailss);

// GET request to retrieve a single Details by id
router.get('/detailsfirstsectioncontent/:id', FooterFirstContentController.getdetailsById);

// PUT request to update a Details by id
router.put('/detailsfirstsectioncontent/:id', FooterFirstContentController.updatedetails);

// DELETE request to delete a Details by id
router.delete('/detailsfirstsectioncontent/:id', FooterFirstContentController.deletedetails);




// Secound section data : 

const FooterSecoundContentController =require('../Controller/FooterSecoundContentController')

router.post('/addsecoundsectioncontent', FooterSecoundContentController.adddetails);

// GET request to retrieve all Detailss
router.get('/detailssecoundsectioncontent', FooterSecoundContentController.getdetailss);

// GET request to retrieve a single Details by id
router.get('/detailssecoundsectioncontent/:id', FooterSecoundContentController.getdetailsById);

// PUT request to update a Details by id
router.put('/detailssecoundsectioncontent/:id', FooterSecoundContentController.updatedetails);

// DELETE request to delete a Details by id
router.delete('/detailssecoundsectioncontent/:id', FooterSecoundContentController.deletedetails);




// subscribe email section data : 

const FooterSubscribeController = require('../Controller/FooterSubscribeController')

router.post('/addfootersubscribeemail', FooterSubscribeController.adddetails);

// GET request to retrieve all Detailss
router.get('/footersubscribeemail', FooterSubscribeController.getdetailss);

// GET request to retrieve a single Details by id
router.get('/footersubscribeemail/:id', FooterSubscribeController.getdetailsById);

// PUT request to update a Details by id
router.put('/footersubscribeemail/:id', FooterSubscribeController.updatedetails);

// DELETE request to delete a Details by id
router.delete('/footersubscribeemail/:id', FooterSubscribeController.deletedetails);






module.exports = router;