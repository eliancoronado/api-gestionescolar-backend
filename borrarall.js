const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
    grado: { type: String, required: true },
    nombre: { type: String, required: true },
    notas: {
        MAT: { type: Number, default: 0 },
        LYL: { type: Number, default: 0 },
        LE: { type: Number, default: 0 },
        EF: { type: Number, default: 0 },
        AEP: { type: Number, default: 0 },
        GEO: { type: Number, default: 0 },
        CCNN: { type: Number, default: 0 },
        TAC: { type: Number, default: 0 },
        CV: { type: Number, default: 0 },
        DDM: { type: Number, default: 0 },
        COND: { type: Number, default: 0 },
    },
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

async function borrarTodosLosEstudiantes() {
    try {
      // Conectar a la base de datos de MongoDB
      await mongoose.connect('mongodb+srv://cuentaparaelian12:HAayjRGRYOSk4F1B@cluster0.citmxdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
  
      // Borrar todos los documentos de la colección de estudiantes
      const resultado = await Estudiante.deleteMany({});
      console.log(`Se han eliminado ${resultado.deletedCount} estudiantes.`);
    } catch (error) {
      console.error('Error al borrar los estudiantes:', error);
    } finally {
      // Cerrar la conexión con MongoDB
      await mongoose.disconnect();
    }
  }
  
  // Ejecutar la función para borrar los estudiantes
  borrarTodosLosEstudiantes();