const Offer = require("../models/offerModel");

// Dohvaćanje svih ponuda
async function getOffers(req, res) {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Stvaranje nove ponude
async function createOffer(req, res) {
  const offer = new Offer(req.body);
  try {
    const newOffer = await offer.save();
    res.status(201).json(newOffer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Ažuriranje postojeće ponude po ID-u
async function updateOffer(req, res) {
  // Implementiraj ažuriranje ponude po ID-u
}

// Brisanje ponude po ID-u
async function deleteOffer(req, res) {
  // Implementiraj brisanje ponude po ID-u
}

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
