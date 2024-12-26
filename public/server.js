const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/ruleta', (req, res) => {
    res.sendFile(__dirname + '/public/ruleta.html');
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ka4317439@gmail.com', // Tu correo
        pass: 'qtni puel uwdv uiwm'  // Tu contraseña de aplicación
    }
});

// Ruta donde guardaremos la lista de participantes
const participantesPath = path.join(__dirname, 'participantes.json');
let participantes = [];

// Verificar si el archivo existe
if (fs.existsSync(participantesPath)) {
    try {
        participantes = JSON.parse(fs.readFileSync(participantesPath));
    } catch (error) {
        console.error('Error al leer el archivo participantes.json:', error);
        participantes = [];  // Si el archivo tiene un error de lectura, reiniciamos el array
    }
} else {
    fs.writeFileSync(participantesPath, JSON.stringify([]));  // Crear archivo vacío si no existe
}

// Premios disponibles
const premiosDisponibles = [
    "1 Pico Rico Gratis", "1 Pico Rico Gratis", "1 Pico Rico Gratis",
    "Cono Crocante Gratis", "Cono Crocante Gratis", "2 Sombreros Gratis",
    "Combo Doble Delicia Acapulco GRATIS", "Combo Doble Delicia Acapulco GRATIS",
    "Un Mes de Helado Gratis", "Súper Combo Navideño",
    "En la lista negra de Santa", "En la lista negra de Santa", "En la lista negra de Santa"
];

// Ruta para enviar el correo con el código
app.post('/enviar-correo', (req, res) => {
    const { correo } = req.body;

    // Verificar si el correo ya ha participado
    if (participantes.some(p => p.correo === correo)) {
        return res.status(400).send('¡Alto ahí, GRINCH! Ya obtuviste tu premio.');
    }

    // Generar código aleatorio
    const codigo = Math.floor(100000 + Math.random() * 900000);

    // Enviar correo con el código
    const mailOptions = {
        from: '"Ruleta Navideña" <ka4317439@gmail.com>',
        to: correo,
        subject: '¡Código de Verificación!',
        text: `Tu código de verificación es: ${codigo}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(500).send('Error al enviar el correo.');
        }

        // Guardar correo y código en el archivo
        participantes.push({ correo, codigo });
        fs.writeFileSync(participantesPath, JSON.stringify(participantes, null, 2));

        res.status(200).send('Correo enviado exitosamente.');
    });
});

// Ruta para verificar el código
app.post('/verificar-codigo', (req, res) => {
    const { correo, codigo } = req.body;

    const participante = participantes.find(p => p.correo === correo);

    if (!participante || participante.codigo !== parseInt(codigo)) {
        return res.status(400).send('Código incorrecto o correo no registrado.');
    }

    // Verificar si el participante ya tiene premio
    if (participante.premio) {
        return res.status(400).send(`¡Vaya, Grinch! 🎄
Ya has reclamado tu premio.: ${participante.premio}`);
    }

    // Asignar un premio único
    if (premiosDisponibles.length === 0) {
        return res.status(400).send('Ups,Lo siento. Todos los premios han sido reclamados. ¡Pero no te pongas triste! 🎁 ');
    }

    // Seleccionar un premio aleatorio
    const premioAsignado = premiosDisponibles.splice(Math.floor(Math.random() * premiosDisponibles.length), 1)[0];
    participante.premio = premioAsignado;

    // Guardar la actualización del participante en el archivo
    fs.writeFileSync(participantesPath, JSON.stringify(participantes, null, 2));

    res.status(200).send(`¡Felicidades, campeón! 🎉
¡Has ganado un premio y nos haces muy felices con tu victoria! 🏆🎁: ${premioAsignado}`);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
