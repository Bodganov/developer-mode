const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Mira tu información o la de otro usuario.")
    .addUserOption(option => option.setName("member").setDescription("Miras la información de otro usuario")),
	async run(client, interaction){
        const member = interaction.options.getMember("member") || interaction.member;
        await interaction.deferReply();

        let Bags = {
            'HOUSE_BRAVERY': '<:bravery:953865124798689331>',
            'DISCORD_EMPLOYEE': '<:staffdiscord:953869071345152000>',
            'PARTNERED_SERVER_OWNER': '<:partner:953869075451367425>',
            'HYPESQUAD_EVENTS': '<:HypeSquad:953869076265062420>',
            'BUGHUNTER_LEVEL_1': '<:bughunter1:953869071445815357>',
            'BUGHUNTER_LEVEL_2': '<:BugHunter2:953869077594664980>',
            'HOUSE_BRILLIANCE': '<:brilliance:953869073027063820>',
            'EARLY_VERIFIED_BOT_DEVELOPER': '<:botverifieddeveloper:953869071374483487> ',
            'DISCORD_CERTIFIED_MODERATOR': '<:moderatordiscord:953869071332560917>'
        }

        setTimeout(() => {
            const embed = new MessageEmbed()
            .setAuthor(`Información de ${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .addField('Nombre de Discord', member.user.tag, true)
            .addField('ID Usuario', member.user.id, true)
            .addField("Cuenta creada el:", member.user.createdAt.toLocaleString(), true)
            .addField("Ingreso", member.joinedAt.toLocaleString(), true)
            .addField("Informacion del servidor", [
                `Apodo: \`${member.nickname !== null ? `${member.nickname}` : 'No'}\``,
                `Booster: \`${member.premiumSince ? 'Si ' + member.premiumSince.toLocaleString() : 'Nope'}\``
            ].join("\n"), true)
            .addField('Badges', `${Bags[member.user.flags.toArray()]}`, true)
            .addField('Roles', `${member.roles.cache.map(roles => `\`${roles.name}\``).join(', ')}`, true)

            interaction.editReply({ embeds: [embed] });
        }, 2000);
	},
};