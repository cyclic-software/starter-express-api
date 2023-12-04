const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  nombre:  String,
  descripcion: String
});

// Crear el modelo
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;