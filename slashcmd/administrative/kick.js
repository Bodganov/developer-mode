const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario del servidor")
    .addUserOption(optionU => 
        optionU
            .setName('target')
            .setDescription('Menciona el usuario que expulsare')
            .setRequired(true))
    .addStringOption(reasonS => 
        reasonS
            .setName('reason')
            .setDescription('Razon por la que expulsare al usuario')),
	async run(client, interaction){
        if(!interaction.member.permissions.has('KICK_MEMBERS')) return interaction.reply({ content: 'No puedes usar este comando', ephemeral: true });
        
        const user = interaction.options.getMember('target');
        const target = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})
        const reason = interaction.options.getString('reason') || null;

        if(!target.kickable || target.user.id === client.user.id) return interaction.reply({ content: 'Este usuario no es kickeable', ephemeral: true });
        if(interaction.member.roles.highest.position <= target.roles.highest.position) return interaction.reply({ content: 'Este usuario tiene un rol mas alto que el mio', ephemeral: true });

        await target.user.send(`Fuiste expulsado del servidor **${interaction.guild.name}**, razon: ${reason}`);
        target.kick({ reason });

        return interaction.reply({ content: `${target.user.tag} fue expulsado del servidor, razon: ${reason}`, ephemeral: true });
	}
}