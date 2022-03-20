const { SlashCommandBuilder } = require('@discordjs/builders');
const NSFW = require("discord-nsfw");
const { MessageEmbed } = require('discord.js');
const nsfw = new NSFW();

module.exports = {
	data: new SlashCommandBuilder()
    .setName("porno")
    .setDescription("Busca contenido 🔞")
	.addStringOption(option =>
		option
			.setName('tipo')
			.setDescription('Tipo de porno')
			.setRequired(true)
			.addChoice('Anal', 'anal_porn')
			.addChoice('4k', 'fourk_porn')
			.addChoice('Gonewild', 'gonewild_porn')),
	async run(client, interaction){
		await interaction.deferReply();

		setTimeout(async() => {
			if(!interaction.channel.nsfw) return interaction.editReply({ content: "Esto no es un canal NSFW", ephemeral: true })
			switch(interaction.options.getString('tipo')){
				case "anal_porn": {
					const anal_embed = new MessageEmbed()
					.setAuthor(interaction.member.displayName, interaction.member.displayAvatarURL({ dynamic: true }))
					.setTitle('Porno Anal')
					.setImage(await nsfw.anal())
					.setColor('#2f3136')
					interaction.editReply({ embeds: [anal_embed] });
				}
				break;
				case "fourk_porn": {
					const fourk_embed = new MessageEmbed()
					.setAuthor(interaction.member.displayName, interaction.member.displayAvatarURL({ dynamic: true }))
					.setTitle('Porno 4k')
					.setImage(await nsfw.fourk())
					.setColor('#2f3136')
					interaction.editReply({ embeds: [fourk_embed] });
				}
				break;
				case "gonewild_porn": {
					const gonewild_embed = new MessageEmbed()
					.setAuthor(interaction.member.displayName, interaction.member.displayAvatarURL({ dynamic: true }))
					.setTitle('Porno Gonewild')
					.setImage(await nsfw.gonewild())
					.setColor('#2f3136')
					interaction.editReply({ embeds: [gonewild_embed] });
				}
			}
		}, 2000)
	}
}