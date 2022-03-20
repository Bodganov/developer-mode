const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
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

module.exports = {
	data: new ContextMenuCommandBuilder()
    .setName("avatar")
    .setType(2),
    async run(client, interaction){
        let user = await interaction.guild.members.fetch(interaction.targetId);

        const embed = new MessageEmbed()
        .setTitle(`Avatar de ${user.user.tag}`)
        .setImage(user.user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setColor(user.displayHexColor === "#000000" ? "#ffffff" : user.displayHexColor);
        interaction.reply({ embeds: [embed] });
    }
}