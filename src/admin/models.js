const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Identifiant Patients
const IdSchema = new Schema({
  cardId: {
    type: String,
  },
});

//Identifiants bloqué
const bloquerSchema = new Schema({
  cardId: {
    type: String,
  },
});

const Identifiant = mongoose.model("cardIds", IdSchema);
const bloquer = mongoose.model("blockedUsers", bloquerSchema);

module.exports = { Identifiant, bloquer };
