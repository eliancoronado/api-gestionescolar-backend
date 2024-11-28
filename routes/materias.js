const express = require("express");
const Materia = require("../models/Materia");
const Estudiante = require("../models/Estudiante");
const connectDB = require('../db');
const mongoose = require("mongoose")

const router = express.Router();

//App DB
connectDB();

// Ruta para obtener todas las materias
router.get("/", async (req, res) => {
  try {
    const materias = await Materia.find();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las materias", error });
  }
});

// Ruta para obtener todas las materias
router.get("/allmaterias", async (req, res) => {
  try {
    const materias = await Materia.countDocuments();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las materias", error });
  }
});

// Ruta para agregar una nueva materia
router.post("/", async (req, res) => {
  const { nombre } = req.body;

  try {
    // Verificar si la materia ya existe
    const existingMateria = await Materia.findOne({ nombre });
    if (existingMateria) {
      return res.status(400).json({ message: "Materia ya existe" });
    }

    const nuevaMateria = new Materia({ nombre });
    await nuevaMateria.save();

    await Estudiante.updateMany(
      {},
      { $set: { [`notas.${nombre}`]: 0 } } // Agrega la materia con nota 0
    );

    res.status(201).json({ message: "Materia agregada exitosamente", nuevaMateria });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la materia", error });
  }
});

// Ruta para eliminar una materia
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar y eliminar la materia por ID
    const materia = await Materia.findByIdAndDelete(id);
    if (!materia) {
      return res.status(404).json({ message: "Materia no encontrada" });
    }

    // Eliminar la materia de las notas de los estudiantes
    const nombreMateria = materia.nombre;
    await Estudiante.updateMany(
      {},
      { $unset: { [`notas.${nombreMateria}`]: "" } } // Elimina la materia de las notas
    );

    res.json({ message: "Materia eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la materia", error });
  }
});


module.exports = router;
