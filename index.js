const { WAConnection } = require('@whiskeysockets/baileys');

const conn = new WAConnection('./session.json);

conn.on('chat-update', async (update) => {
  if (update.messages) {
    const message = update.messages.all()[0];
    const text = message.message.conversation;

   
    if (message.message) {
      console.log('Mensaje recibido:', text);

    
      const response = `Hola! Has dicho: "${text}"`;
      conn.sendMessage(message.key.remoteJid, response, MessageType.text);
    }
  }
});


conn.connect();

// Informar cuando el bot esté listo
conn.on('conecting', () => {
  console.log('Bot conectado!');
});
