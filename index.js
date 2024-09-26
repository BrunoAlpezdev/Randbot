const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const roles = ['Duelista', 'Iniciador', 'Controlador', 'Centinela'];
const personajes = {
    Duelista: ['Jett', 'Raze', 'Phoenix', 'Yoru', 'Reyna', 'Iso', 'Neon'],
    Iniciador: ['Breach', 'Sova', 'KAY/O', 'Skye', 'Fade', 'Gekko'],
    Controlador: ['Omen', 'Viper', 'Brimstone', 'Astra', 'Clove', 'Harbor'],
    Centinela: ['Cypher', 'Killjoy', 'Sage', 'Chamber', 'Deadlock', 'Vyse']
};


client.once('ready', () => {
    console.log('¡Bot en línea!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignora los mensajes de otros bots

    if (message.content.startsWith('!randomize')) {
        const args = message.content.split(' ');
        const name = args[1];
        const randomRole = roles[Math.floor(Math.random() * roles.length)];

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
                message.channel.send(`${name}. Tu Rol es: \`${randomRole}\`. Jugarás con: \`${randomAgent.displayName}\``);
            } else {
                message.channel.send(`No se encontraron agentes jugables para el rol '${randomRole}'.`);
            }
        } catch (error) {
            console.error('Error al obtener los agentes:', error);
            message.channel.send('Hubo un error al obtener los agentes. Intenta nuevamente más tarde.');
        }
    }
});

client.login(process.env.BOT_TOKEN);