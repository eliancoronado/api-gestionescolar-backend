const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  materia: { type: String, required: true },
  grado: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true }
});

const Profesor = mongoose.model('Profesor', profesorSchema);

module.exports = Profesor;
