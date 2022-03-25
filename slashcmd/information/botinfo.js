const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require("moment");
const osu = require("node-os-utils");
const os = require("os");
require("moment-duration-format");
const diagramMaker = require('../../functions/diagrameMaker');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Devuelve el estado del bot.'),
    async run(client, interaction) {
        await interaction.deferReply();

        setTimeout(async() =>{
            let cpuUsage
            const cpu = osu.cpu

            const promises = [
                client.shard.fetchClientValues('guilds.cache.size'),
                client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
                cpu.usage().then(cpuPercentage => {
                    cpuUsage = cpuPercentage
                })
            ];

            Promise.all(promises).then(async results => {
                const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

                var mem = osu.mem
                let freeRAM, usedRAM
        
                await mem.info().then(info => {
                    freeRAM = info['freeMemMb']
                    usedRAM = info['totalMemMb'] - freeRAM
                });
        
                const statusEmbed = new MessageEmbed()
                .setAuthor({ name: `Status de: ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .addField('Rendimiento', `RAM: ${diagramMaker(usedRAM, freeRAM)} [${Math.round((100 * usedRAM / (usedRAM + freeRAM)))}%]\nCPU: ${diagramMaker(cpuUsage, 100 - cpuUsage)} [${Math.round(cpuUsage)}%]`, false)
                .addField('Sistema', `Procesador\nIntel ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`, true)
                .addField('Sistema Operativo', `${os.type} ${os.release} ${os.arch}`, true)
                .addField('Usuarios', `${totalMembers}`, true)
                .addField('Emojis', `${client.emojis.cache.size}`, true)
                .addField('Actividad del Host', `${moment.duration(os.uptime * 1000).format(`D [Días], H [Horas], m [Minutos], s [Segundos]`)}`, true)
                .addField('Actividad del Bot', `${moment.duration(client.uptime).format(`D [Días], H [Horas], m [Minutos], s [Segundos]`)}`, true)
                .addField('Último Inicio', `${moment(client.readyAt).format("DD [de] MMM YYYY HH:mm")}`, true)
                .addField('Comandos', `${client.slashcommands.size}`, true)
                .addField('Categorias', `.`, true)
                .setColor('PURPLE');
                interaction.editReply({ embeds: [statusEmbed] })
            })
        }, 2000)
    }
}