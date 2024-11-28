const express = require('express');
const router = express.Router();
const Profesor = require('../models/Profesor');
const bcrypt = require('bcrypt');

// Función para generar usuario único
const generarUsuario = (nombre) => {
  const nombreBase = nombre.split(' ')[0].toLowerCase();
  const sufijo = Math.floor(Math.random() * 1000);
  return `${nombreBase}${sufijo}`;
};

// Crear nuevo profesor
router.post('/', async (req, res) => {
  try {
    const { nombre, materia, grado } = req.body;

    // Generar usuario y contraseña automáticos
    const usuario = generarUsuario(nombre);
    const contraseñaSinHash = `${usuario}${Math.floor(1000 + Math.random() * 9000)}`; // Contraseña simple

    // Crear el nuevo profesor sin hashear la contraseña
    const nuevoProfesor = new Profesor({
      nombre,
      materia,
      grado,
      usuario,
      contraseña: contraseñaSinHash // Guardar la contraseña en texto claro
    });

    // Guardar el profesor en la base de datos
    const profesorGuardado = await nuevoProfesor.save();

    // Enviar respuesta al cliente con la contraseña original
    res.status(201).json({
      message: 'Profesor agregado correctamente',
      profesor: { ...profesorGuardado._doc, contraseña: contraseñaSinHash } // Mostrar contraseña original
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar profesor', error });
  }
});

// Obtener todos los profesores
router.get('/', async (req, res) => {
  try {
    const profesores = await Profesor.find();
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener profesores', error });
  }
});

// Obtener todos los profesores
router.get('/:id/alldata', async (req, res) => {
  try {
    const profesores = await Profesor.findById(req.params.id);
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener profesores', error });
  }
});

// Obtener todos los profesores
router.get('/all', async (req, res) => {
  try {
    const profesores = await Profesor.countDocuments();
    res.status(200).json(profesores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener profesores', error });
  }
});

// Eliminar profesor por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profesorEliminado = await Profesor.findByIdAndDelete(id);
    if (!profesorEliminado) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    res.status(200).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar profesor', error });
  }
});


module.exports = router;
