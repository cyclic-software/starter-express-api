const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");

// Ruta za dohvaćanje svih ponuda
router.get("/offers", offerController.getOffers);

// Ruta za stvaranje nove ponude
router.post("/offers", offerController.createOffer);

// Ruta za ažuriranje postojeće ponude po ID-u
router.put("/offers/:id", offerController.updateOffer);

// Ruta za brisanje ponude po ID-u
router.delete("/offers/:id", offerController.deleteOffer);

module.exports = router;