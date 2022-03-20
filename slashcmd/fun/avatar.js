const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Mira el avatar de otro usuario")
    .addUserOption(option => option.setName('member').setDescription('Menciona el usuario que veras el avatar').setRequired(false)),
	async run(client, interaction){
        const member = interaction.options.getMember("member") || interaction.member;

        const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
        .setImage(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
        await interaction.reply({ embeds: [embed] });
	}
}