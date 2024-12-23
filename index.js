// Release 3.0
const { personajes, capitalizeFirstLetter, loadAgentes, getMap } = require('./methods.js');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { PREFIX, RELEASE, roles, mapas, rolesMap } = require('./data.js');
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
    console.log(`¡Bot en línea. Versión ${RELEASE}!`);
    loadAgentes(); 
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Bot is running smoothly',
    });
});

client.on('messageCreate', async message => {
    // Si el mensaje es del bot, no hacer nada.
    if (message.author.bot) return; 

    // Si el mensaje no empieza con el prefijo, no hacer nada.
    if (!message.content.startsWith(PREFIX)) return;
    
    const args = message.content.split(' ');
    let mapArg = args[1];
    let rolArg = args[2];
    let map = mapArg ? mapArg.charAt(0).toUpperCase() + mapArg.slice(1).toLowerCase() : null;
    let rol = rolArg ? rolArg.charAt(0).toUpperCase() + rolArg.slice(1).toLowerCase() : null;

    const mensaje = message.content.toLowerCase();

    console.log('Comando recibido:', mensaje);
    console.log('Mapa:', map);
    console.log('Rol:', rol);

    if (mensaje === `${PREFIX}channel here`) {
        targetChannelId = message.channel.id;
        message.channel.send('Este canal ha sido configurado.');
    }

    if (targetChannelId && message.channel.id === targetChannelId) {
        
        if (mensaje.startsWith(`${PREFIX}servidores`)) {
            const guilds = client.guilds.cache.map(guild => guild.name).
            message.channel.send(`Estoy en los siguientes servidores:\n${guilds}`);
            return;
        }
        
        if (mensaje.startsWith(`${PREFIX}roles`)) {
            message.channel.send(`Roles disponibles: ${roles.join(', ')}`);
            return;
        }
        
        if (mensaje.startsWith(`${PREFIX}personajes`)) {
            const personajesArray = Object.values(personajes).flat().map(agent => agent.displayName);
            message.channel.send(`Personajes disponibles: ${personajesArray.join(', ')}`);
            return;
        }
        
        if (mensaje.startsWith(`${PREFIX}mapas`)) {
            message.channel.send(`Mapas disponibles: ${Object.keys(mapas).join(', ')}`);
            return;
        }
        
        if (mensaje.startsWith(`${PREFIX}randhelp`) || mensaje.startsWith(`${PREFIX}rhelp`)) {
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
        
        if (mensaje.startsWith(`${PREFIX}randomize`) || mensaje.startsWith(`${PREFIX}r`)) {
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
            
        }
    });
    
    
    client.login(process.env.BOT_TOKEN);