const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const roles = ['Duelista', 'Centinela', 'Controlador', 'Iniciador'];
const personajes = {}; // Aquí almacenarás los personajes obtenidos de la API

// Función para cargar los agentes de Valorant
async function loadAgentes() {
    try {
        const response = await axios.get('https://valorant-api.com/v1/agents?language=es-ES');
        const agentes = response.data.data;

        agentes.forEach(agent => {
            if (agent.isPlayableCharacter) {
                const role = agent.role.displayName; // El rol ya estará en español
                if (!personajes[role]) {
                    personajes[role] = [];
                }
                personajes[role].push(agent); // Almacena el objeto del agente completo
            }
        });

        console.log('Agentes cargados:', Object.keys(personajes).length);
    } catch (error) {
        console.error('Error al obtener los agentes:', error);
    }
}

client.once('ready', () => {
    console.log(`¡Bot en línea!`);
    loadAgentes(); // Carga los agentes al iniciar el bot
});

// Listener para manejar el comando de randomización
client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignora los mensajes de otros bots

    if (message.content.startsWith('!randomize')) {
        const args = message.content.split(' ');
        const name = args[1];
        
        if (!name) {
            message.channel.send('Por favor, especifica un nombre. Ejemplo: `!randomize [nombre]`');
            return;
        }

        const randomRole = roles[Math.floor(Math.random() * roles.length)];

        // Verificar si hay personajes disponibles para el rol
        if (!personajes[randomRole] || personajes[randomRole].length === 0) {
            message.channel.send(`No hay personajes disponibles para el rol: ${randomRole}`);
            return;
        }

        const randomPersonaje = personajes[randomRole][Math.floor(Math.random() * personajes[randomRole].length)];

        // Crea el embed
        const embed = new EmbedBuilder()
        .setColor(randomPersonaje.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff') // Color del embed, remueve el 'ff' y usa color predeterminado si no hay colores
            .setTitle(`¡${name}, tu rol es: ${randomRole}!`) // Usar randomRole aquí
            .setDescription(`Jugarás con: **${randomPersonaje.displayName}**`)
            .setThumbnail(randomPersonaje.role.displayIcon) // Icono pequeño del personaje
            .setImage(randomPersonaje.fullPortrait) // Imagen grande del personaje
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
});

// Inicia el bot con tu token
client.login(process.env.BOT_TOKEN);
