const mongoose = require("mongoose");

const playedGameSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  playedGames: [
    {
      eventId: {
        type: Number,
        required: true,
      },
      homeResult: {
        type: Number,
        required: true,
      },
      awayResult: {
        type: Number,
        required: true,
      },
    },
  ],
  playerData: {
    mail: {
      type: String,
      required: true,
      default: "mail@nagradna.igra",
    },
    mobile: {
      type: String,
      required: false,
    },
    billNumber: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    areaCode: {
      type: Number,
      required: false,
    },
  },
});

const PlayedGame = mongoose.model("PlayedGame", playedGameSchema);

module.exports = PlayedGame;