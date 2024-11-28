//Importaciones
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./db');
const Materia = require("./models/Materia");
const Estudiante = require("./models/Estudiante");
const materiasRoutes = require("./routes/materias");
const teacherRoutes = require("./routes/teachers");
const authRoutes = require("./routes/auth");

//App usages
const app = express()
app.use(cors())
app.use(bodyParser.json());

//App Routes
app.use("/materias", materiasRoutes);
app.use("/profesores", teacherRoutes);
app.use("/auth", authRoutes);

//App DB
connectDB();

//App configs
const upload = multer({ dest: 'uploads/' });

//App routes
app.get('/', (req, res) => {
    res.send("Hello World");  // Error: `res.end` ya no es una función
});

app.get('/allstudents', async (req, res) => {
  try {
    // Contar el número total de estudiantes en la colección
    const totalEstudiantes = await Estudiante.countDocuments();
    res.status(201).json(totalEstudiantes)
    console.log(`Número total de estudiantes: ${totalEstudiantes}`);
  } catch (error) {
    console.error('Error al contar los estudiantes:', error);
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const xlsx = require('xlsx');
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    try {
        // Procesar cada fila del archivo Excel
        const estudiantes = sheetData.map((row) => ({
            grado: row.Grado,
            nombre: row.Nombre,
        }));

        // Insertar estudiantes en la base de datos con notas inicializadas
        await Estudiante.insertMany(estudiantes.map((estudiante) => ({
            grado: estudiante.grado,
            nombre: estudiante.nombre,
            notas: {}, // Notas inicializadas en 0 automáticamente por el esquema
        })));

        res.status(201).json({ message: 'Datos subidos exitosamente', estudiantes });
    } catch (error) {
        console.error('Error subiendo datos:', error);
        res.status(500).json({ message: 'Error al subir los datos', error });
    }
});

app.put('/estudiante/:id', async (req, res) => {
    const { id } = req.params;
    const { notas } = req.body;

    try {
        const estudiante = await Estudiante.findByIdAndUpdate(
            id,
            { $set: { notas } },
            { new: true }
        );

        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        res.status(200).json({ message: 'Notas actualizadas', estudiante });
    } catch (error) {
        console.error('Error actualizando notas:', error);
        res.status(500).json({ message: 'Error al actualizar notas', error });
    }
});

// Endpoint para obtener todos los estudiantes
app.get('/estudiantes', async (req, res) => {
    try {
        const estudiantes = await Estudiante.find();
        res.status(200).json(estudiantes);
    } catch (error) {
        console.error('Error obteniendo estudiantes:', error);
        res.status(500).json({ message: 'Error al obtener estudiantes' });
    }
});

// Ruta para obtener estudiantes según el grado
app.get('/estudiantes/:grado', async (req, res) => {
    const grado = req.params.grado;
  
    try {
      // Buscar los estudiantes del curso seleccionado
      const estudiantes = await Estudiante.find({ grado: grado });
      res.json(estudiantes);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los estudiantes');
    }
  });

// Ruta para eliminar un estudiante por ID
app.delete('/estudiantes/:id', async (req, res) => {
    try {
      const estudianteId = req.params.id;
  
      // Eliminar estudiante de la base de datos
      const result = await Estudiante.findByIdAndDelete(estudianteId);
  
      if (!result) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
      }
  
      res.status(200).json({ message: 'Estudiante eliminado exitosamente' });
    } catch (error) {
      console.error('Error eliminando estudiante:', error);
      res.status(500).json({ message: 'Error al eliminar el estudiante', error });
    }
  });
  
  app.put('/estudiantes/:id/notas', async (req, res) => {
    try {
      const { materia, notas } = req.body;
  
      // Validar que los datos sean correctos
      if (!materia || !notas || !Array.isArray(notas)) {
        return res.status(400).json({ message: 'Datos inválidos' });
      }
  
      // Sumar las notas
      const sumaNotas = notas.reduce((acc, nota) => acc + nota, 0);
  
      // Buscar el estudiante por su ID
      const estudiante = await Estudiante.findById(req.params.id);
      if (!estudiante) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
      }
  
      // Actualizar o establecer la nota en el Map de notas
      estudiante.notas.set(materia, sumaNotas);
  
      // Guardar los cambios
      await estudiante.save();
  
      // Responder al cliente con los datos actualizados
      res.status(200).json({ message: 'Notas actualizadas correctamente', estudiante });
  
      console.log(`Notas actualizadas para ${materia}: ${sumaNotas}`);
    } catch (error) {
      console.error('Error al actualizar notas:', error);
      res.status(500).json({ message: 'Error al actualizar las notas' });
    }
  });

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});