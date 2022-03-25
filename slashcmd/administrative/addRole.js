const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Asigna un rol a un usuario')
    .addUserOption(usuario => usuario.setName('usuario').setDescription('Asignale el rol al usuario').setRequired(true))
    .addRoleOption(role => role.setName('role').setDescription('Asigna el rol').setRequired(true)),
    async run(client, interaction){
        const Target = interaction.options.getMember('usuario');
        const Role = interaction.options.getRole('role');

        if(interaction.member.roles.highest.comparePositionTo(Target.roles.highest) <= 0){
            return interaction.reply({ content: "No puedes agregarle roles a este usuario", ephemeral: true });
        }
        if(interaction.guild.me.roles.highest.comparePositionTo(Target.roles.highest) <= 0){
            return interaction.reply({ content: "No puedo agregarle un rol a este usuario", ephemeral: true });
        }
        if(interaction.guild.me.roles.highest.comparePositionTo(Role) <= 0){
            return interaction.reply({ content: "No puedo agregar este rol", ephemeral: true });
        }

        Target.roles.add(Role.id);
        return interaction.reply({ content: `${interaction.user} agregó el rol \`${Role.name}\` a ${Target.user}`})
    }
}