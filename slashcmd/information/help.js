const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Comando de soporte general'),
    async run(client, interaction){
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('goto_back')
            .setLabel('Casa')
            .setEmoji('🏠')
            .setStyle('SUCCESS')
        );

        const embed = new MessageEmbed()
        .setTitle(`Soporte de ${client.user.username}`)
        .setDescription(
            `_Bienvenido a mi centro de soporte ${interaction.user.username}, aca podras ver todos mis comandos y otros tipos de soporte que te ayudaran mucho\n[Servidor de soporte](https://youtube.com/)\nTengo ${client.slashcommands.size} comandos, y mas de 6 categorias._`
        )
        .setFooter({ text: `Selecciona algo del menu para ver los comandos`, iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await interaction.reply({ embeds: [embed], components: [row] });
        
        const filtero = i => i.customId === 'goto_back' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: filtero, time: 5000 });

        collector.on('collect', async(i) => {
            if(i.isButton());
            if(i.customId === 'goto_back'){
                await i.update({ content: 'Hola', components: [], embeds: [] })
            }
        });

        collector.on('end', async() => {
            await interaction.editReply({ content: 'Tiempo acabado', components: [], embeds: [] });
        })
    }
}