const PlayedGame = require("../models/playedGamesModel");

// Dohvaćanje svih ponuda
async function getPlayedGames(req, res) {
  try {
    const playedGames = await PlayedGame.find();
    res.json(playedGames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Stvaranje nove ponude
async function createPlayedGame(req, res) {
  const playedGame = new PlayedGame(req.body);
  try {
    const newPlayedGame = await playedGame.save();
    res.status(201).json(newPlayedGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Ažuriranje postojeće ponude po ID-u
async function updatePlayedGame(req, res) {
  // Implementiraj ažuriranje ponude po ID-u
}

// Brisanje ponude po ID-u
async function deletePlayedGame(req, res) {
  // Implementiraj brisanje ponude po ID-u
}

module.exports = {
  getPlayedGames,
  createPlayedGame,
  updatePlayedGame,
  deletePlayedGame,
};
