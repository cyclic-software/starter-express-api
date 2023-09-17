const express = require("express");
const router = express.Router();
const playedGameController = require("../controllers/playedGamesController");

// Ruta za dohvaćanje svih ponuda
router.get("/playedgames", playedGameController.getPlayedGames);

// Ruta za stvaranje nove ponude
router.post("/playedgames", playedGameController.createPlayedGame);

// Ruta za ažuriranje postojeće ponude po ID-u
router.put("/playedgames/:id", playedGameController.updatePlayedGame);

// Ruta za brisanje ponude po ID-u
router.delete("/playedgames/:id", playedGameController.deletePlayedGame);

module.exports = router;