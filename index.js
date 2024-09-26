const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express'); // Importa express
const axios = require('axios');

const app = express(); // Crea una aplicación de Express
const PORT = process.env.PORT || 3000; // Usa el puerto especificado por Render

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const roles = ['Duelista', 'Centinela', 'Controlador', 'Iniciador'];
const mapas = {
    'Ascent': {
        'Duelista': ['Jett', 'Reyna', 'Phoenix'],
        'Centinela': ['Cypher', 'Killjoy'],
        'Controlador': ['Omen', 'Brimstone'],
        'Iniciador': ['Sova', 'KAY/O', 'Gekko']
    },
    'Bind': {
        'Duelista': ['Raze', 'Reyna', 'Iso', 'Jett', 'Yoru'],
        'Centinela': ['Cypher', 'Killjoy', 'Vyse', 'Sage', 'Deadlock', 'Chamber'],
        'Controlador': ['Viper', 'Brimstone', 'Astra'],
        'Iniciador': ['Skye', 'Breach', 'Fade', 'Sova', 'Gekko']
    },
    'Haven': {
        'Duelista': ['Jett', 'Phoenix', 'Reyna', 'Neon'],
        'Centinela': ['Cypher', 'Killjoy', 'Chamber'],
        'Controlador': ['Omen', 'Brimstone', 'Clove'],
        'Iniciador': ['Sova', 'Breach', 'Skye', 'Gekko']
    },
    'Icebox': {
        'Duelista': ['Jett', 'Reyna', 'Yoru', 'Iso'],
        'Centinela': ['Sage', 'Killjoy', 'Deadlock', 'Chamber'],
        'Controlador': ['Viper', 'Harbor'],
        'Iniciador': ['Sova', 'KAY/O', 'Gekko']
    },
    'Split': {
        'Duelista': ['Raze', 'Reyna', 'Jett', 'Yoru', 'Iso', 'Neon'],
        'Centinela': ['Cypher', 'Killjoy', 'Vyse', 'Sage', 'Deadlock', 'Chamber'],
        'Controlador': ['Omen', 'Brimstone', 'Astra', 'Clove'],
        'Iniciador': ['Breach', 'Skye', 'KAY/O', 'Gekko']
    },
    'Breeze': {
        'Duelista': ['Jett', 'Reyna', 'Yoru', 'Iso'],
        'Centinela': ['Cypher', 'Killjoy', 'Chamber'],
        'Controlador': ['Viper', 'Astra', 'Harbor'],
        'Iniciador': ['Sova', 'Skye', 'KAY/O', 'Gekko']
    },
    'Fracture': {
        'Duelista': ['Raze', 'Reyna', 'Iso', 'Jett', 'Neon'],
        'Centinela': ['Cypher', 'Killjoy', 'Chamber'],
        'Controlador': ['Brimstone', 'Astra', 'Clove', 'Viper', 'Harbor'],
        'Iniciador': ['Breach', 'Skye', 'Fade', 'Gekko']
    },
    'Lotus': {
        'Duelista': ['Jett', 'Raze', 'Iso', 'Reyna', 'Neon'],
        'Centinela': ['Cypher', 'Killjoy', 'Sage', 'Chamber'],
        'Controlador': ['Omen', 'Brimstone'],
        'Iniciador': ['Sova', 'Breach', 'Gekko']
    },
    'Pearl': {
        'Duelista': ['Jett', 'Reyna', 'Neon', 'Phoenix'],
        'Centinela': ['Cypher', 'Killjoy', 'Chamber', 'Sage'],
        'Controlador': ['Viper', 'Astra', 'Harbor'],
        'Iniciador': ['Sova', 'Skye', 'Gekko', 'Breach', 'KAY/O', 'Fade']
    }
};
const personajes = {}; // Aquí almacenarás los personajes obtenidos de la API

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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

async function getMap(mapName) {
    try {
        const response = await axios.get('https://valorant-api.com/v1/maps');
        const maps = response.data.data;
        const map = maps.find(map => map.displayName.toLowerCase() === mapName.toLowerCase());
        return map ? map.splash : null; // Return null if the map isn't found
    } catch (error) {
        console.error('Error al obtener los mapas:', error);
        return null; // Handle errors gracefully
    }
}
client.once('ready', () => {
    console.log(`¡Bot en línea!`);
    loadAgentes(); // Carga los agentes al iniciar el bot
});

// Escucha en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


// Listener para manejar el comando de randomización
client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignora los mensajes de otros bots
    const args = message.content.split(' ');
    const map = args[1];

    if (message.content.startsWith('!randomize') && !map) {
        const author = message.author;
        const username = author.username; // Nombre de usuario
        const avatarURL = author.displayAvatarURL(); // URL del avatar

        const randomRole = roles[Math.floor(Math.random() * roles.length)]; // Obtiene un rol aleatorio

        const randomPersonaje = personajes[randomRole][Math.floor(Math.random() * personajes[randomRole].length)];

        // Crea el embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: username, iconURL: avatarURL}) // Nombre y avatar del autor
            .setColor(randomPersonaje.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff') // Color del embed, remueve el 'ff' y usa color predeterminado si no hay colores
            .setTitle(`¡${capitalizeFirstLetter(username)}, tu rol es: ${randomRole}!`) // Usar randomRole aquí
            .setDescription(`Jugarás con: **${randomPersonaje.displayName}**`)
            .setThumbnail(randomPersonaje.role.displayIcon) // Icono pequeño del personaje
            .setImage(randomPersonaje.fullPortrait) // Imagen grande del personaje
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }

    if (message.content.startsWith('!randomize') && map) {
        const author = message.author;
        const username = author.username; // Nombre de usuario
        const avatarURL = author.displayAvatarURL(); // URL del avatar

        if (!mapas[map]) {
            message.channel.send(`El mapa "${map}" no es válido. Por favor, elige uno de los siguientes: ${Object.keys(mapas).join(', ')}`);
            return;
        }

        const randomRole = roles[Math.floor(Math.random() * roles.length)]; // Obtiene un rol aleatorio
        const personajesPorMapa = mapas[map][randomRole]; // Obtiene los personajes del rol para el mapa especificado

        if (!personajesPorMapa || personajesPorMapa.length === 0) {
            message.channel.send(`No hay personajes disponibles para el rol "${randomRole}" en el mapa "${map}".`);
            return;
        }

        if (!personajesPorMapa || personajesPorMapa.length === 0) {
            message.channel.send(`No hay personajes disponibles para el rol "${randomRole}" en el mapa "${map}".`);
            return;
        }

        const randomPersonaje = personajesPorMapa[Math.floor(Math.random() * personajesPorMapa.length)]; // Obtiene un personaje aleatorio del rol y mapa
        const mapImage = await getMap(capitalizeFirstLetter(map)) // URL de la imagen del mapa

        // Crea el embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: username, iconURL: avatarURL}) // Nombre y avatar del autor
            .setColor(randomPersonaje.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff') // Color del embed, remueve el 'ff' y usa color predeterminado si no hay colores
            .setTitle(`¡${capitalizeFirstLetter(username)}, tu rol es: ${randomRole}!`) // Usar randomRole aquí
            .setDescription(`Jugarás con: **${randomPersonaje.displayName}**`)
            .setThumbnail(randomPersonaje.displayIcon) // Icono pequeño del personaje
            .setImage(mapImage) // Imagen grande del personaje
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
});

// Inicia el bot con tu token
client.login(process.env.BOT_TOKEN);
