// Release 2.0
const PREFIX = '!';
const roles = ['Duelista', 'Centinela', 'Controlador', 'Iniciador'];
const mapas = {
    'Ascent': {
        'Duelista': ['Jett', 'Reyna', 'Phoenix', 'Iso', 'Neon', 'Raze'],
        'Centinela': ['Cypher', 'Killjoy', 'Vyse', 'Chamber', 'Deadlock'],
        'Controlador': ['Omen', 'Brimstone', 'Astra'],
        'Iniciador': ['Sova', 'KAY/O', 'Gekko', 'Fade']
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
        'Controlador': ['Omen', 'Brimstone', 'Clove', 'Astra'],
        'Iniciador': ['Sova', 'Breach', 'Skye', 'Gekko']
    },
    'Icebox': {
        'Duelista': ['Jett', 'Reyna', 'Yoru', 'Iso', 'Neon'],
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
        'Duelista': ['Jett', 'Reyna', 'Yoru', 'Iso', 'Neon'],
        'Centinela': ['Cypher', 'Chamber'],
        'Controlador': ['Viper', 'Harbor'],
        'Iniciador': ['Sova', 'Skye', 'KAY/O', 'Gekko']
    },
    'Fracture': {
        'Duelista': ['Raze', 'Reyna', 'Iso', 'Jett', 'Neon'],
        'Centinela': ['Cypher', 'Killjoy', 'Chamber'],
        'Controlador': ['Brimstone', 'Astra', 'Viper', 'Harbor'],
        'Iniciador': ['Breach', 'Skye', 'Fade', 'Gekko']
    },
    'Lotus': {
        'Duelista': ['Jett', 'Raze', 'Iso', 'Reyna', 'Neon'],
        'Centinela': ['Cypher', 'Killjoy', 'Sage', 'Chamber'],
        'Controlador': ['Omen', 'Brimstone', 'Harbor'],
        'Iniciador': ['Sova', 'Breach', 'Gekko', 'Fade']
    },
    'Pearl': {
        'Duelista': ['Jett', 'Reyna', 'Neon', 'Phoenix', 'Raze', 'Iso'],
        'Centinela': ['Cypher', 'Killjoy', 'Chamber', 'Sage', 'Deadlock'],
        'Controlador': ['Viper', 'Astra', 'Harbor', 'Omen'],
        'Iniciador': ['Sova', 'Skye', 'Gekko', 'KAY/O', 'Fade']
    }
};

module.exports = {
    PREFIX,
    roles,
    mapas
};