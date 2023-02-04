const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedecinSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  sex: {
    type: String,
    required: true,
  },
  generalist: {
    type: Boolean,
    required: false,
  },
  specialist: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    required: false,
  },
  token: {
    type: String,
  },
});

const Medecin = mongoose.model("Medecins", MedecinSchema);

module.exports = { Medecin };
