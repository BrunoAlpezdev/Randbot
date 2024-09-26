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
                personajes[role].push(agent.displayName); // Almacena el nombre del agente
            }
        });

        console.log('Agentes cargados:', personajes);
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
        const randomRole = roles[Math.floor(Math.random() * roles.length)];

        if (!name) {
            message.channel.send('Por favor, especifica un nombre. Ejemplo: `!randomize [nombre]`');
            return;
        }

        // Verificar si el rol está definido en personajes
        const randomPersonaje = personajes[randomRole][Math.floor(Math.random() * personajes[randomRole].length)];

        // Crea el embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`¡${name}, tu rol es: ${randomRole}!`)
            .setDescription(`Jugarás con: ${randomPersonaje}`)
            .setThumbnail(`https://valorant-api.com/v1/agents/${randomPersonaje.id}/displayIcon`) // Asegúrate de usar el ID correcto
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
});

// Inicia el bot con tu token
client.login(process.env.BOT_TOKEN);
