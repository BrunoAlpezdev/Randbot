const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express'); 
const axios = require('axios');

const app = express(); 
const PORT = process.env.PORT || 3000; 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const PREFIX = '!'; // Command prefix
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
const personajes = {}; 

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function loadAgentes() {
    try {
        const response = await axios.get('https://valorant-api.com/v1/agents?language=es-ES');
        const agentes = response.data.data;

        agentes.forEach(agent => {
            if (agent.isPlayableCharacter) {
                const role = agent.role.displayName; 
                if (!personajes[role]) {
                    personajes[role] = [];
                }
                personajes[role].push(agent); 
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
    loadAgentes(); 
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; 
    const args = message.content.split(' ');
    const map = args[1];

    if (message.content.startsWith(`${PREFIX}randomize`)) {
        const author = message.author;
        const username = author.username; 
        const avatarURL = author.displayAvatarURL(); 

        const randomRole = roles[Math.floor(Math.random() * roles.length)]; 
        const randomPersonaje = personajes[randomRole][Math.floor(Math.random() * personajes[randomRole].length)];

        const embed = new EmbedBuilder()
            .setAuthor({ name: username, iconURL: avatarURL })
            .setColor(randomPersonaje.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff') 
            .setTitle(`¡${capitalizeFirstLetter(username)}, tu rol es: ${randomRole}!`) 
            .setDescription(`Jugarás con: **${randomPersonaje.displayName}**`)
            .setThumbnail(randomPersonaje.role.displayIcon)
            .setImage(randomPersonaje.fullPortrait) 
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        if (map) {
            if (!mapas[map]) {
                message.channel.send(`El mapa "${map}" no es válido. Por favor, elige uno de los siguientes: ${Object.keys(mapas).join(', ')}`);
                return;
            }

            const personajesPorMapa = mapas[map][randomRole]; 
            if (!personajesPorMapa || personajesPorMapa.length === 0) {
                message.channel.send(`No hay personajes disponibles para el rol "${randomRole}" en el mapa "${map}".`);
                return;
            }

            const randomPersonajeMapName = personajesPorMapa[Math.floor(Math.random() * personajesPorMapa.length)];
            const randomPersonajeMap = personajes[randomRole].find(agent => agent.displayName === randomPersonajeMapName);
            const mapImage = await getMap(capitalizeFirstLetter(map)); // Use await here

            const mapEmbed = new EmbedBuilder()
                .setAuthor({ name: username, iconURL: avatarURL })
                .setColor(randomPersonajeMap.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff')
                .setTitle(`¡${capitalizeFirstLetter(username)}, tu rol es: ${randomRole}!`)
                .setDescription(`Jugarás con: **${randomPersonajeMap.displayName}**`)
                .setThumbnail(randomPersonajeMap.displayIcon)
                .setImage(mapImage || 'default_image_url_here') // Handle null map image
                .setTimestamp();

            message.channel.send({ embeds: [mapEmbed] });
        }
    }
});


client.login(process.env.BOT_TOKEN);