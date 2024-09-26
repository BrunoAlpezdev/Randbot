// Release 1.1
const axios = require('axios');

const personajes = {}; 

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function loadAgentes() {
    try {
        const response = await axios.get('https://valorant-api.com/v1/agents?language=es-ES');
        const agentes = response.data.data;

        agentes.forEach(agent => {
            if (agent.isPlayableCharacter) {
                const role = agent.role.displayName; 
                if (!personajes[role]) {
                    personajes[role] = [];
                }
                personajes[role].push(agent); 
            }
        });

        console.log('Agentes cargados:', Object.keys(personajes).length);
    } catch (error) {
        console.error('Error al obtener los agentes:', error);
    }
}

async function getMap(mapName) {
    try {
        const response = await axios.get('https://valorant-api.com/v1/maps');
        const maps = response.data.data;
        const map = maps.find(map => capitalizeFirstLetter(map.displayName) === capitalizeFirstLetter(mapName));
        return map ? map.splash : null; // Return null if the map isn't found
    } catch (error) {
        console.error('Error al obtener los mapas:', error);
        return null; // Handle errors gracefully
    }
}

module.exports = {
    personajes,
    capitalizeFirstLetter,
    loadAgentes,
    getMap
};