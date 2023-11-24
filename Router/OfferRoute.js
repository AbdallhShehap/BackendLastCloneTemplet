const express = require('express');
const router = express.Router();

const OfferController =require('../Controller/OfferController')

router.post('/add', OfferController.addOffer);

// GET request to retrieve all Offer
router.get('/offer', OfferController.getOffers);

// GET request to retrieve a single Offer by id
router.get('/offer/:id', OfferController.getOfferById);

// PUT request to update a Offer by id
router.put('/offer/:id', OfferController.updateOffer);

// DELETE request to delete a Offer by id
router.delete('/offer/:id', OfferController.deleteOffer);

module.exports = router;