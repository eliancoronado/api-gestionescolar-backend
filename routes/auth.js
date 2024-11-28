const express = require('express');
const Profesor = require('../models/Profesor'); // Ruta del modelo
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ruta de login
router.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({ message: 'Por favor ingrese usuario y contraseña' });
  }

  try {
    // Buscar al profesor por el nombre de usuario
    const profesor = await Profesor.findOne({ usuario });

    if (!profesor) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña es correcta
    if (profesor.contraseña !== contraseña) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: profesor._id, usuario: profesor.usuario },
      'secreto_de_tu_aplicacion', // Cambia esto por una clave secreta segura
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Responder con el token y un mensaje de éxito
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      profesor: {
        id: profesor._id,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

module.exports = router;
