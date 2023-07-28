const { WAConnection } = require('@adiwajshing/baileys');

// Crea una nueva instancia de la conexión de WhatsApp
const conn = new WAConnection();

// Función para manejar los mensajes entrantes
conn.on('message-new', async (message) => {
  // Si el mensaje es de un chat grupal, ignorarlo
  if (message.isGroupMsg) return;

  // Obtener el número del remitente del mensaje
  const senderNumber = message.key.remoteJid;

  // Obtener el contenido del mensaje
  const text = message.message.conversation;

  // Responder al mensaje
  const reply = `Hola, soy tu bot y recibí tu mensaje: "${text}"`;

  // Enviar la respuesta
  conn.sendMessage(senderNumber, reply, MessageType.text);
});

// Iniciar sesión en WhatsApp
conn.connect();

// Manejar errores
conn.on('open', () => {
  console.log('Conexión establecida. El bot está listo.');
});

conn.on('close', (err) => {
  console.error('La conexión se cerró inesperadamente:', err);
});

conn.on('ws-close', (err) => {
  console.error('La conexión WebSocket se cerró inesperadamente:', err);
});
