const {
     default: WAConnection,
     useMultiFileAuthState,
     generateWAMessageFromContent,
     makeCacheableSignalKeyStore
 } = require('@whiskeysockets/baileys')

const pino = require('pino')
const { format } = require('util')
const { exec } = require('child_process')
const cfonts = require('cfonts')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const Parser = require('expr-eval').Parser
const i18n = require('i18n')

const configFile = 'config.json'

const date = new Date()
const parser = new Parser();

const supportedLanguages = ['en', 'es', 'fr', 'de'];

let commandsConfig = {};
let areCommandsEnabled = true

const getConfig = () => {
    try {
        const data = fs.readFileSync(configFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
};

const saveConfig = (config) => {
    try {
        fs.writeFileSync(configFile, JSON.stringify(config, null, 4), 'utf8');
    } catch (error) {
        console.error('Error al guardar la configuración en config.json:', error);
    }
};

const sendFile = (filePath, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error interno del servidor');
    } else {
      res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      res.end(data);
    }
  });
};

const config = getConfig();
if (config.hasOwnProperty('areCommandsEnabled')) {
    areCommandsEnabled = config.areCommandsEnabled;
}

const setCommandsState = (isEnabled) => {
    areCommandsEnabled = isEnabled;
    const config = getConfig();
    config.areCommandsEnabled = isEnabled;
    saveConfig(config);
};
        
        
if (fs.existsSync(configFile)) {
    const configData = fs.readFileSync(configFile, 'utf8');
    commandsConfig = JSON.parse(configData);
} else {
    fs.writeFileSync(configFile, JSON.stringify(commandsConfig, null, 2), 'utf8');
}

i18n.configure({
    locales:['en', 'es'],
    directory: __dirname + '/locales'
});

const { execute, commandString } = require('./src/commands');
const { banner, getGlobalSpinner, splitMessage } = require('./lib/functions')
const { prefix, owner }  = require('./config')



const start = async () => {

    console.log(banner)
    const spinner = getGlobalSpinner();
    spinner.start('Verificando sesión...')
    const sessionFolderPath = 'session';
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolderPath)
    const level = pino({ level: 'silent' })

    try {
        const sessionExists = fs.existsSync(start)
        setTimeout(() => {
            spinner.succeed('Sesión existente encontrada.');
        }, 3000)
    } catch (error) {
        spinner.succeed('No se encontró sesión existente. Escanee el código QR.');
    }

    const client = WAConnection({
        logger: level,
        printQRInTerminal: true,
        browser: ['SigmaBot', 'Firefox', '3.0.0'],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, level),
        }
    })
    
    client.ev.on('connection.update', v => {
        const { connection, lastDisconnect } = v
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== 401) {
                start()
            } else {
                exec('rm -rf session')
                console.error('Conexión con WhatsApp cerrada, Escanee nuevamente el código qr!')
                start()
            }
        } else if (connection == 'open') {
            setTimeout(() => {
                console.log(`Sigma es online`)
            }, 3000);
        }
    })
