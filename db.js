const mongoose = require('mongoose');

// Configuración de la conexión a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://cuentaparaelian12:HAayjRGRYOSk4F1B@cluster0.citmxdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        process.exit(1); // Salir del proceso si no se puede conectar
    }
};

module.exports = connectDB;
