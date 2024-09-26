// Release 1.0
const { capitalizeFirstLetter, loadAgentes, getMap } = require('./methods.js');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { PREFIX, roles, mapas } = require('./data.js');
const PORT = process.env.PORT || 3000; 
const express = require('express'); 
const personajes = {}; 
const app = express(); 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

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

        if (!map) {
            const embed = new EmbedBuilder()
            .setAuthor({ name: username, iconURL: avatarURL })
            .setColor(randomPersonaje.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff') 
            .setTitle(`¡${capitalizeFirstLetter(username)}, tu rol es: ${randomRole}!`) 
            .setDescription(`Jugarás con: **${randomPersonaje.displayName}**`)
            .setThumbnail(randomPersonaje.role.displayIcon)
            .setImage(randomPersonaje.fullPortrait) 
            .setTimestamp();
            
            message.channel.send({ embeds: [embed] });   
            return;
        }

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
            const mapImage = await getMap(capitalizeFirstLetter(map))
            const mapEmbed = new EmbedBuilder()
                .setAuthor({ name: username, iconURL: avatarURL })
                .setColor(randomPersonajeMap.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff')
                .setTitle(`¡${capitalizeFirstLetter(username)}, tu rol es: ${randomRole}!`)
                .setDescription(`Jugarás con: **${randomPersonajeMap.displayName}**`)
                .setThumbnail(randomPersonajeMap.displayIcon)
                .setImage(mapImage || 'default_image_url_here')
                .setTimestamp();

            message.channel.send({ embeds: [mapEmbed] });
            return;
        }
    }
});


client.login(process.env.BOT_TOKEN);