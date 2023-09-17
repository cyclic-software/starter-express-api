const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  matchList: [
    {
      eventId: { type: Number, required: true },
      homeId: { type: Number, required: true },
      awayId: { type: Number, required: true },
      startingTime: { type: Date, required: true },
    },
  ],
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
