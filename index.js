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

client.on('messageCreate', message => {
    if (message.author.bot) return; // Ignora los mensajes de otros bots

    

    if (message.content.startsWith('!randomize')) {
        const args = message.content.split(' ');
        const name = args[1];
        const randomRole = args[1];

        if (!name) {
            message.channel.send('Por favor, especifica un nombre. Ejemplo: `!randomize [nombre]`');
            return;
        }

        // Verificar si el rol está definido en personajes
        if (personajes[randomRole]) {
            const randomPersonaje = personajes[randomRole][Math.floor(Math.random() * personajes[randomRole].length)];
            message.channel.send(`Personaje aleatorio para ${randomRole}: ${randomPersonaje}`);
        } else {
            message.channel.send(`El rol '${randomRole}' no está definido.`);
            console.error(`El rol '${randomRole}' no está definido en personajes.`);
        }
    }
});


client.login(process.env.BOT_TOKEN);