// Release 2.0
const { personajes, capitalizeFirstLetter, loadAgentes, getMap } = require('./methods.js');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { PREFIX, roles, mapas, rolesMap } = require('./data.js');
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

let targetChannelId = null;

client.once('ready', () => {
    console.log(`¡Bot en línea. Versión 2.5.4!`);
    loadAgentes(); 
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; 
    const args = message.content.split(' ');
    let map = args[1];
    let rol = args[2];

    console.log('Comando recibido:', message.content);
    console.log('Mapa:', map);
    console.log('Rol:', rol);

    if (message.content === `${PREFIX}channel here`) {
        targetChannelId = message.channel.id;
        message.channel.send('Este canal ha sido configurado.');
    }

    if (targetChannelId && message.channel.id === targetChannelId) {
        
        if (message.content.startsWith(`${PREFIX}servidores`)) {
            const guilds = client.guilds.cache.map(guild => guild.name).
            message.channel.send(`Estoy en los siguientes servidores:\n${guilds}`);
            return;
        }
        
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
                { name: `${PREFIX}channel here`, value: `Permite establecer el servidor por defecto para interactuar con el bot (¡Debes hacerlo!).` },
                { name: `${PREFIX}randomize`, value: `Genera un personaje aleatorio para jugar en Valorant.` },
                { name: `${PREFIX}randomize [mapa]`, value: `Genera un personaje aleatorio para jugar en Valorant en un mapa específico. Ejemplo: ${PREFIX}randomize Ascent` },
                { name: `${PREFIX}randomize [mapa] [rol]`, value: `Genera un personaje aleatorio para jugar en Valorant en un mapa y rol específico. Ejemplo: ${PREFIX}randomize Ascent Duelista` },
                { name: `${PREFIX}roles`, value: `Muestra los roles disponibles en Valorant.` },
                { name: `${PREFIX}personajes`, value: `Muestra los personajes disponibles en Valorant.` },
                { name: `${PREFIX}mapas`, value: `Muestra los mapas disponibles en Valorant.` },
                { name: `${PREFIX}changePrefix`, value: `Permite cambiar el prefijo de '!' a por ejemplo '-' (-r) .` },
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
                if (!mapas[capitalizeFirstLetter(map)]) {
                    message.channel.send(`El mapa "${map}" no es válido. Por favor, elige uno de los siguientes: ${Object.keys(mapas).join(', ')}`);
                    return;
                }
                
                const personajesPorMapa = mapas[capitalizeFirstLetter(map)][randomRole]; 
                
                if (!personajesPorMapa || personajesPorMapa.length === 0) {
                    message.channel.send(`No hay personajes disponibles para el rol "${randomRole}" en el mapa "${map}".`);
                    return;
                }
                
                if (rol) {
                    const capitalizedRol = capitalizeFirstLetter(rol);
                    rol = rolesMap[capitalizedRol] || rol;
                    
                    const personajesPorRol = personajes[capitalizeFirstLetter(rol)];
                    if (!personajesPorRol || personajesPorRol.length === 0) {
                        message.channel.send(`No hay personajes disponibles para el rol "${rol}".`);
                        return;
                    }
                    
                    const personajesPorMapaRol = mapas[capitalizeFirstLetter(map)][capitalizeFirstLetter(rol)]; 
                    console.log(`Personajes para el mapa: ${map}: `, personajesPorMapaRol);
                    
                    if (!personajesPorMapaRol || personajesPorMapaRol.length === 0) {
                        message.channel.send(`No hay personajes disponibles para el rol "${rol}" en el mapa "${map}".`);
                        return;
                    }
                    
                    const randomPersonajeMapaRol = personajesPorMapaRol[Math.floor(Math.random() * personajesPorMapaRol.length)];
                    console.log(randomPersonajeMapaRol);
                    
                    const PersonajeMapaRol = personajes[capitalizeFirstLetter(rol)].find(agent => agent.displayName === randomPersonajeMapaRol);
                    
                    const mapImage = await getMap(capitalizeFirstLetter(map))
                    
                    const rolEmbed = new EmbedBuilder()
                    .setAuthor({ name: username, iconURL: avatarURL })
                    .setColor(PersonajeMapaRol.backgroundGradientColors?.[0]?.replace(/ff$/, '') || '#0099ff')
                    .setTitle(`¡${capitalizeFirstLetter(username)}, elegiste el rol: ${capitalizeFirstLetter(rol)}!`)
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
            
        } else {
            if (message.content.startsWith(`${PREFIX}`)) {
                message.channel.send(`Por favor, configura este canal para usar el bot. Usa el comando \`${PREFIX}channel here\` en el canal donde deseas usar el bot. el canal configurado actualmente es: ${targetChannelId ? `<#${targetChannelId}>` : 'ninguno'}`);
            }
        }
    });
    
    
    client.login(process.env.BOT_TOKEN);