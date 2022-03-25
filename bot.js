//CUERPO PRINCIPAL
const Discord = require('discord.js');
const { Client, Collection, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] })

require('colors');

//.ENV
require('dotenv').config();

//MODULO FILTERSCRIPTS
const fs  = require('fs');
const path = require('path');

// -- base de datos
const mongoose = require('mongoose');
mongoose.connect(process.env.URLMONGOO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`DataBase Connect.`.green);
}).catch((err) => {
    console.log(`Error in load of DataBase`.red)
});

// -- Cargado de slash commands
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = []

fs.readdirSync('./slashcmd').forEach(async(categorys) => {
    const slashcommandsFile = fs.readdirSync(`./slashcmd/${categorys}`).filter((archivo) => archivo.endsWith('js'))
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
            Routes.applicationCommands(process.env.clientid), {
                body: commands
            }
        )
        console.log(`Slash Commands Loaded`.green);
    } catch(e) {
        console.log(e)
    }
}

// -- Resto del codigo

client.slashcommands = new Collection();
fs.readdirSync('./slashcmd').forEach(async(categorys) => {
    const slashcommandsFile = fs.readdirSync(`./slashcmd/${categorys}`).filter((archivo) => archivo.endsWith('.js'))
    for(const archivo of slashcommandsFile){
        const slash = require(`./slashcmd/${categorys}/${archivo}`)
        client.slashcommands.set(slash.data.name, slash)
        console.log(`SlashCommands - ${categorys}/${archivo} Loaded.`.yellow);
    }
});

    // --- EVENTOS --- //
const events = fs.readdirSync(path.join(__dirname, 'events'));
for(const folders of events){
    const folder = fs.readdirSync(path.join(__dirname, 'events', folders));
    for(const file of folder){
        const event = require(path.join(__dirname, 'events', folders, file));
        client.on(event.name, (...args) => event.run(client, ...args));
        console.log(`Events - ${folders}/${file}(${event.name}) Loaded.`.yellow);
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
        client.user.setActivity(`Servers: ${guildNum} Members: ${memberNum}`, { type: 'WATCHING' })
    }).catch(console.error)
}

client.login(process.env.token).catch(() => console.log(`Specify a valid token`.red));