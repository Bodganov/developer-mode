//CUERPO PRINCIPAL
const Discord = require('discord.js');
const { Client, Collection, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] })

require('colors');

//.ENV
require('dotenv').config();

//MODULO FILTERSCRIPTS
const { readdirSync } = require('fs');

// -- Barras funcion
const { BarrasVerdes, BarrasRojas } = require('./functions/barrasDiagram');

// -- base de datos
const mongoose = require('mongoose');
mongoose.connect(process.env.URLMONGOO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    BarrasVerdes(`Base de datos conectada`);
}).catch((err) => {
    BarrasRojas(`Error en conexión a la base de datos`)
});

// -- Cargado de slash commands
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = []

readdirSync('./slashcmd').forEach(async(categorys) => {
    const slashcommandsFile = readdirSync(`./slashcmd/${categorys}`).filter((archivo) => archivo.endsWith('js'))
    for(const archivo of slashcommandsFile){
        const slash = require(`./slashcmd/${categorys}/${archivo}`)
        commands.push(slash.data.toJSON())
    }
})

const rest = new REST({ version: '9' }).setToken(process.env.token);

createSlash();

async function createSlash(){
    try{
        await rest.put(
            Routes.applicationCommands(process.env.clientid, process.env.serverid), {
                body: commands
            }
        )
        BarrasVerdes(`Slash Commands Cargados`);
    } catch(e) {
        console.log(e)
    }
}

// -- Resto del codigo

client.slashcommands = new Collection();
readdirSync('./slashcmd').forEach(async(categorys) => {
    const slashcommandsFile = readdirSync(`./slashcmd/${categorys}`).filter((archivo) => archivo.endsWith('.js'))
    for(const archivo of slashcommandsFile){
        const slash = require(`./slashcmd/${categorys}/${archivo}`)
        console.log(`SlashCommands - ${categorys}/${archivo} cargados.`.yellow);
        client.slashcommands.set(slash.data.name, slash)
    }
});

    // --- EVENTOS --- //
client.comandos = new Collection();
for(const file of readdirSync('./eventos/')){
    if(file.endsWith('.js')){
        let filename = file.substring(0, file.length - 3);
        let filecontent = require(`./eventos/${file}`);
        client.on(filename, filecontent.bind(null, client));
    }
}

setInterval(() => {
    updateStatus()
}, 60000)

async function updateStatus() {
    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
    ]
    Promise.all(promises).then(results => {
        const guildNum = results[0].reduce((acc, guildCount) => acc + guildCount, 0)
        const memberNum = results[1].reduce((acc, memberCount) => acc + memberCount, 0)
        client.user.setActivity(`Servidores: ${guildNum} Miembros: ${memberNum}`, { type: 'LISTENING'})
    }).catch(console.error)
}

client.login(process.env.token).catch(() => console.log(`-[X]- NO HAS ESPECIFICADO UN TOKEN VALIDO -[X]-`.red));