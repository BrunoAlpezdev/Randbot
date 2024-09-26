const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const roles = ['Duelista', 'Iniciador', 'Controlador', 'Centinela'];
const personajes = [{duelista: ['Jett', 'Raze', 'Phoenix', 'Yoru', 'Reyna', 'Iso', 'Neon']},
                    {iniciador: ['Breach', 'Sova', 'KAY/O', 'Skye', 'Fade', 'Gekko']},
                    {controlador: ['Omen', 'Viper', 'Brimstone', 'Astra', 'Clove', 'Harbor']},
                    {centinela: ['Cypher', 'Killjoy', 'Sage', 'Chamber', 'Deadlock', 'Vyse']}];


client.once('ready', () => {
    console.log('¡Bot en línea!');
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignora los mensajes de otros bots

    // Verifica si el mensaje comienza con !randomize
    if (message.content.startsWith('!randomize')) {
        const args = message.content.split(' ');
        const name = args[1];

        if (!name) {
            message.channel.send('Por favor, especifica un nombre. Ejemplo: `!randomize [nombre]`');
            return;
        }

        // Selecciona un rol aleatorio de la lista de roles
        const randomRole = roles[Math.floor(Math.random() * roles.length)];

        // Selecciona un personaje aleatorio basado en el rol
        const randomPersonaje = personajes[randomRole][Math.floor(Math.random() * personajes[randomRole].length)];

        // Envía el rol y personaje aleatorio asignado al nombre
        message.channel.send(`${name} ha sido asignado como: ${randomRole}, con el personaje: ${randomPersonaje}`);
    }
});

client.login(process.env.BOT_TOKEN);