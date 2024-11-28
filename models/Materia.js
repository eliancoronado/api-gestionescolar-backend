const mongoose = require("mongoose");

// Definir el esquema de la colección de Materias
const materiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

materiaSchema.post("save", async function () {
  try {
    const nuevaMateria = this.nombre;

    // Agrega el campo de la nueva materia a todos los estudiantes
    await Estudiante.updateMany(
      { [`notas.${nuevaMateria}`]: { $exists: false } }, // Solo si no existe
      { $set: { [`notas.${nuevaMateria}`]: 0 } } // Agregar con valor 0
    );

    console.log(`Nueva materia "${nuevaMateria}" añadida a los estudiantes.`);
  } catch (error) {
    console.error("Error al actualizar estudiantes con nueva materia:", error);
  }
});

const Materia = mongoose.model("Materia", materiaSchema);

module.exports = Materia;
