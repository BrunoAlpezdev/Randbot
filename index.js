// Release 1.1
const { personajes, capitalizeFirstLetter, loadAgentes, getMap } = require('./methods.js');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { PREFIX, roles, mapas } = require('./data.js');
const PORT = process.env.PORT || 3000; 
const express = require('express'); 
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
    const rol = args[2];

    console.log('Comando recibido:', message.content);
    console.log('Mapa:', map);
    console.log('Rol:', rol);

    if (message.content.startsWith(`${PREFIX}roles`)) {
        message.channel.send(`Roles disponibles: ${roles.join(', ')}`);
        return;
    }

    if (message.content.startsWith(`${PREFIX}personajes`)) {
        const personajesArray = Object.values(personajes).flat().map(agent => agent.displayName);
        message.channel.send(`Personajes disponibles: ${personajesArray.join(', ')}`);
        return;
    }

    if (message.content.startsWith(`${PREFIX}mapas`)) {
        message.channel.send(`Mapas disponibles: ${Object.keys(mapas).join(', ')}`);
        return;
    }

    if (message.content.startsWith(`${PREFIX}randhelp`) || message.content.startsWith(`${PREFIX}rhelp`)) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('¡Comandos disponibles!')
            .setDescription(`¡Hola! Soy Randbot, técnicamente un Valorant Randomizer xd, te ayudaré a elegir un personaje aleatorio para jugar en Valorant. ¡Aquí tienes los comandos disponibles!`)
            .addFields(
                { name: `${PREFIX}randomize`, value: `Genera un personaje aleatorio para jugar en Valorant.` },
                { name: `${PREFIX}randomize [mapa]`, value: `Genera un personaje aleatorio para jugar en Valorant en un mapa específico. Ejemplo: ${PREFIX}randomize Ascent` },
                { name: `${PREFIX}randomize [mapa] [rol]`, value: `Genera un personaje aleatorio para jugar en Valorant en un mapa y rol específico. Ejemplo: ${PREFIX}randomize Ascent Duelista` },
                { name: `${PREFIX}roles`, value: `Muestra los roles disponibles en Valorant.` },
                { name: `${PREFIX}personajes`, value: `Muestra los personajes disponibles en Valorant.` },
                { name: `${PREFIX}mapas`, value: `Muestra los mapas disponibles en Valorant.` },
                { name: `${PREFIX}help`, value: `Muestra los comandos disponibles.` },
            )
            .setTimestamp();
        
        message.channel.send({ embeds: [embed] });
        return;
    }

    if (message.content.startsWith(`${PREFIX}randomize`) || message.content.startsWith(`${PREFIX}r`)) {
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

            if (rol) {
                if (!roles.includes(rol)) {
                    message.channel.send(`El rol "${rol}" no es válido. Por favor, elige uno de los siguientes: ${roles.join(', ')}`);
                    return;
                }
    
                const personajesPorRol = personajes[rol];
                if (!personajesPorRol || personajesPorRol.length === 0) {
                    message.channel.send(`No hay personajes disponibles para el rol "${rol}".`);
                    return;
                }
                
                const personajesPorMapaRol = mapas[map][rol]; 
                console.log(`Personajes para el mapa: ${map}: `, personajesPorMapaRol);
                
                const randomPersonajeMapaRol = personajesPorMapaRol.find[Math.floor(Math.random() * personajesPorMapaRol.length)];
                console.log(randomPersonajeMapaRol);

                const PersonajeMapaRol = personajes[rol].find(agent => agent.displayName === randomPersonajeMapaRol);
                
                const mapImage = await getMap(capitalizeFirstLetter(map))
    
                const rolEmbed = new EmbedBuilder()
                    .setAuthor({ name: username, iconURL: avatarURL })
                    .setColor(PersonajeMapaRol.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff')
                    .setTitle(`¡${capitalizeFirstLetter(username)}, elegiste el rol: ${rol}!`)
                    .setDescription(`Jugarás con: **${PersonajeMapaRol.displayName}**`)
                    .setThumbnail(PersonajeMapaRol.displayIcon)
                    .setImage(mapImage || 'default_image_url_here')
                    .setTimestamp();
    
                message.channel.send({ embeds: [rolEmbed] });
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