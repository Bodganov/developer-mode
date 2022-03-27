const { Client, Collection } = require('discord.js');
const client = new Client({ intents: 32767 })

require('colors');

require('dotenv').config();

const fs  = require('fs');
const path = require('path');

const mongoose = require('mongoose');
mongoose.connect(process.env.URLMONGOO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`DataBase Connect.`.green);
}).catch(() => {
    console.log(`Error in load of DataBase`.red)
});

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

client.slashcommands = new Collection();
fs.readdirSync('./slashcmd').forEach(async(categorys) => {
    const slashcommandsFile = fs.readdirSync(`./slashcmd/${categorys}`).filter((archivo) => archivo.endsWith('.js'))
    for(const archivo of slashcommandsFile){
        const slash = require(`./slashcmd/${categorys}/${archivo}`)
        client.slashcommands.set(slash.data.name, slash)
        console.log(`SlashCommands - ${categorys}/${archivo} Loaded.`.yellow);
    }
});

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