const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName("verificar")
    .setDescription("Verifica a los usuarios")
    .addSubcommand(subcmd => 
        subcmd
            .setName('pueblo1')
            .setDescription('Verifica el usuario al pueblo 1')
            .addUserOption(option => option.setName('usuariop1').setDescription('Usuario que sera verificado').setRequired(true))
            .addRoleOption(option => option.setName('rolep1').setDescription('El rol que verificara').setRequired(true)))
    .addSubcommand(subcmd2 =>
        subcmd2 
            .setName('pueblo2')
            .setDescription('Verifica el usuario al pueblo 2')
            .addUserOption(option => option.setName('usuariop2').setDescription('Usuario que sera verificado').setRequired(true))
            .addRoleOption(option => option.setName('rolep2').setDescription('El rol que verificara').setRequired(true))),
	async run(client, interaction){
        await interaction.deferReply({ ephemeral: true });
        setTimeout(async() => {
            if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({
                content: "No puedes usar este comando",
                ephemeral: true
            });

            const memberp1 = interaction.options.getMember('usuariop1');
            const memberp2 = interaction.options.getMember('usuariop2');

            const rolep1 = interaction.options.getRole('rolep1');
            const rolep2 = interaction.options.getRole('rolep2');

            if(interaction.options.getSubcommand() === 'pueblo1'){
                memberp1.roles.add(rolep1.id);
                await interaction.editReply({
                    content: `${memberp1.user.tag} fue verificado en el pueblo 1\nRoles agregados: \`${rolep1.name} (${rolep1.id})\``,
                    ephemeral: true
                });
            } else if(interaction.options.getSubcommand() === 'pueblo2'){
                memberp2.roles.add(rolep2.id);
                await interaction.editReply({
                    content: `${memberp2.user.tag} fue verificado en el pueblo 2\nRoles agregados: \`${rolep2.name} (${rolep2.id})\``,
                    ephemeral: true
                });
            }
        }, 2000)
	}
}