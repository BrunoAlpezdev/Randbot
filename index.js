const { Client, GatewayIntentBits } = require('discord.js');

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

client.on('messageCreate', message => {
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
        message.channel.send(`${name}. Tu Rol es: ``${randomRole}``. Jugarás con:``${randomPersonaje}```);

    }
});


client.login(process.env.BOT_TOKEN);