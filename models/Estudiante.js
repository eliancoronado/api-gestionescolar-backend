const mongoose = require("mongoose");

// Esquema y Modelo de Estudiantes
const estudianteSchema = new mongoose.Schema({
    grado: { type: String, required: true },
    nombre: { type: String, required: true },
    notas: { type: Map, of: Number, default: {} }, // Usamos Map para flexibilidad
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante;