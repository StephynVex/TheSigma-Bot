const fs = require('fs');
const { WAConnection, MessageType } = require('@whiskeysockets/baileys');

// Leer el archivo config.json
const rawdata = fs.readFileSync('config.json');
const config = JSON.parse(rawdata);

// Obtener la configuración del número de teléfono del administrador
const adminPhoneNumber = config.adminPhoneNumber;

// Función para verificar si el remitente del mensaje es el administrador
function isAdminMessage(message) {
  return message.key.remoteJid === adminPhoneNumber;
}

// Crear una nueva instancia de la conexión de WhatsApp
const conn = new WAConnection();

// Configurar la sesión
conn.logger.level = 'warn'; // Puedes ajustar el nivel de registro según tus necesidades

// Iniciar sesión con WhatsApp utilizando las configuraciones
conn.loadAuthInfo(config.sessionId, config.authToken);
conn.connect();

// Evento para manejar la conexión
conn.on('open', () => {
  console.log('Conexión establecida. El bot está listo.');
});

// Evento para manejar mensajes entrantes
conn.on('message-new', async (message) => {
  if (isAdminMessage(message)) {
    // Si el remitente es el administrador
    console.log('Mensaje del administrador recibido:', message.message.conversation);
    // Aquí puedes agregar lógica para responder a los mensajes del administrador, si lo deseas.
    const reply = `Hola, soy tu bot y recibí tu mensaje: "${message.message.conversation}"`;
    conn.sendMessage(adminPhoneNumber, reply, MessageType.text);
  } else {
    // Si el remitente no es el administrador
    console.log('Mensaje de un usuario no autorizado recibido:', message.message.conversation);
    // Aquí puedes agregar lógica para responder a los mensajes de usuarios no autorizados, si lo deseas.
  }
});
