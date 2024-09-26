const { Client, GatewayIntentBits, EmbedBuilder  } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const roles = ['Duelista', 'Iniciador', 'Controlador', 'Centinela'];
const rolesMapping = {
    "Duelista": "Duelist",
    "Controlador": "Controller",
    "Iniciador": "Initiator",
    "Centinela": "Sentinel"
};

client.once('ready', () => {
    console.log('¡Bot en línea!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignora los mensajes de otros bots

    if (message.content.startsWith('!randomize')) {
        const args = message.content.split(' ');
        const name = args[1];
        const randomRoleSpanish = roles[Math.floor(Math.random() * roles.length)];
        const randomRole = rolesMapping[randomRoleSpanish]; // Obtener el rol en inglés

        if (!name) {
            message.channel.send('Por favor, especifica un nombre. Ejemplo: `!randomize [nombre]`');
            return;
        }

        try {
            // Realiza la solicitud a la API de Valorant para obtener los agentes
            const response = await axios.get('https://valorant-api.com/v1/agents');
            const agents = response.data.data;

            // Filtra los agentes según el rol y si son jugables
            const filteredAgents = agents.filter(agent => 
                agent.role && 
                agent.role.displayName.toLowerCase() === randomRole.toLowerCase() && 
                agent.isPlayableCharacter
            );

            // Elegir un agente aleatorio del rol filtrado
            if (filteredAgents.length > 0) {
                const randomAgent = filteredAgents[Math.floor(Math.random() * filteredAgents.length)];

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Personaje Randomizado')
                    .setDescription(`${name}, tu rol es: **${randomRole}**`)
                    .addFields(
                        { name: 'Personaje', value: randomPersonaje, inline: true }
                    )
                    .setThumbnail(`https://valorant-api.com/v1/agents/${randomPersonaje.id}/displayicon`) // Cambia esto si necesitas una URL diferente para el icono
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            } else {
                message.channel.send(`No se encontraron agentes jugables para el rol '${randomRoleSpanish}'.`);
            }
        } catch (error) {
            console.error('Error al obtener los agentes:', error);
            message.channel.send('Hubo un error al obtener los agentes. Intenta nuevamente más tarde.');
        }
    }
});

client.login(process.env.BOT_TOKEN);