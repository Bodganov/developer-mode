const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
let server_model = require('../../schemas/server/serverSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('config-server')
    .setDescription('Establece y mira la configuracion del servidor'),
    async run(client, interaction){
        let dato = await server_model.findOne({ GuildID: interaction.guild.id });

        const embed = new MessageEmbed()
        .setTitle(`Informacion del servidor ${interaction.guild.name}`)

        if(dato.levelsSetup === false || dato.economiaSetup === false){
            embed.setDescription('__Todos los sistemas estan desabhilitados__');
        }

        if(dato.levelsSetup !== false){
            embed.addField('Sistema de niveles', `Activo`);
        }

        interaction.reply({ embeds: [embed] })
    }
}