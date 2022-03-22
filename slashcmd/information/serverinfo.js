const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra la informacion del servidor"),
	async run(client, interaction){
        await interaction.deferReply();
        const owner = await interaction.guild.fetchOwner();
        setTimeout(() => {
            const embed = new MessageEmbed()
            .setAuthor(`Servidor: ${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
            .addField("Informacion del servidor", [
                `**ID del servidor:** \`${interaction.guild.id}\``,
                `**Dueno del servidor:** \`${owner.user.username}\``,
                `**ID dueno del servidor:** \`${owner.user.id}\``
            ].join("\n"))
            .addField("Fechas", [
                `**Fecha de creador:** \`${interaction.guild.joinedAt.toLocaleString()}\``
            ].join("\n"))
            .addField("Usuario", [
                `**Usuario:** \`${interaction.guild.memberCount - interaction.guild.members.cache.filter(m => m.user.bot).size}\``,
                `**Bots:** \`${interaction.guild.members.cache.filter(m => m.user.bot).size}\`\n`,
                `**Total:** \`${interaction.guild.memberCount}\``
            ].join("\n"))
            .addField("Canales", [
                `**Texto:** \`${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size}\``,
                `**Voz** \`${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size}\``,
                `**Hilos** \`${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_NEW_THREAD' && 'GUILD_PRIVATE_THREAD' && 'GUILD_PUBLIC_THREAD').size}\``,
                `**Categorias** \`${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size}\``,
                `**Stages** \`${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_STAGE_VOICE').size}\``,
                `**News** \`${interaction.guild.channels.cache.filter(c => c.type === 'GUILD_NEWS').size}\`\n`,
                `**Total** \`${interaction.guild.channels.cache.size}\``
            ].join("\n"))
            .addField("Emojis y Stickets", [
                `**Animados** \`${interaction.guild.emojis.cache.filter(e => e.animated).size}\``,
                `**Estaticos** \`${interaction.guild.emojis.cache.filter(e => !e.animated).size}\``,
                `**Stickets** \`${interaction.guild.stickers.cache.size}\`\n`,
                `**Total** \`${interaction.guild.emojis.cache.size + interaction.guild.stickers.cache.size}\``
            ].join("\n"))
            .addField("Roles", [
                `**Roles** \`${interaction.guild.roles.cache.size}\``
            ].join("\n"))
            .addField("Status Premium", [
                `**Boosts** \`${interaction.guild.premiumSubscriptionCount}\``,
                `**Boosters** \`${interaction.guild.members.cache.filter((m) => m.premiumSince).size}\``
            ].join("\n"))
            .setColor('PURPLE');
            interaction.editReply({ embeds: [embed] });
        }, 2000);
	},
};