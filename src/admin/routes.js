const express = require("express");
const router = express.Router();
const { createNewcardId, bloquecardId } = require("./controller");

//Ajouter une nouvelle carte de santé
router.post("/cardId", async (req, res) => {
  try {
    //getting data from form body
    let { cardId } = req.body;

    cardId = cardId.trim();

    if (!cardId) {
      throw Error("Un ou plusieurs champs vides!!!");
    } else {
      // good credentials, create new user function in controller file
      const newcardId = await createNewcardId({
        cardId,
      });
      res.status(200).json(newcardId);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//bloquer un utilisateur(patient/medecin) par l'Id de la carte de santé
router.post("/bloquecardId", async (req, res) => {
  try {
    //getting data from form body
    let { cardId } = req.body;

    cardId = cardId.trim();

    if (!cardId) {
      throw Error("Un ou plusieurs champs vides!!!");
    } else {
      // good credentials, create new user function in controller file
      const newcardId = await bloquecardId({
        cardId,
      });
      res.status(200).json(newcardId);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Ajouter un nouveau medecin dans le systeme
router.post("/new_doctor", async (req, res) => {});

module.exports = router;
