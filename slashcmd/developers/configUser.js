const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const ecoUser = require('../../schemas/users/userSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configura a gusto el usuario')
    .addUserOption(UserNew => 
        UserNew.
            setName('usuario')
            .setDescription('Establece la configuracion del usuario')
            .setRequired(true))
    .addStringOption(StringO => 
        StringO 
            .setName('choice')
            .setDescription('Selecciona el tipo de dato')
            .setRequired(true)
            .addChoice('Premium', 'set-premium'))
    .addStringOption(falseotrue => 
        falseotrue
            .setName('choice_dos')
            .setDescription('Selecciona que sera')
            .setRequired(true)
            .addChoice('Activar', 'dar_vip')
            .addChoice('Desactivar', 'quitar_vip')
            .addChoice('Pago Maximo', 'pago_maximo')),
    async run(client, interaction){
        const Target = interaction.options.getMember('usuario');
        let dato = await ecoUser.findOne({ member: Target.user.id });
        if(Target.user.bot) return interaction.reply({ content: "No puedo configurar usuarios", ephemeral: true });

        switch(interaction.options.getString('choice')){
            case "set-premium": {
                switch(interaction.options.getString('choice_dos')){
                    case "dar_vip": {
                        if(!dato) return interaction.reply({ content: "Vuelve a ejecutar el comando.", ephemeral: true });
                        if(dato.Premium === true) return interaction.reply({ content: "este usuario ya es premium", ephemeral: true });
                        await ecoUser.findOneAndUpdate({ member: Target.user.id }, { Premium: true, PagoExtra: 500 });
                        return interaction.reply({ content: `Premium añadido correctamente a ${Target.user}`, ephemeral: true });
                    }
                    case "quitar_vip": {
                        if(!dato) return interaction.reply({ content: "Vuelve a ejecutar el comando.", ephemeral: true });
                        if(dato.Premium === false) return interaction.reply({ content: "este usuario no es premium", ephemeral: true });
                        interaction.reply({ content: `Premium removido correctamente a ${Target.user}`, ephemeral: true });
                        return await ecoUser.findOneAndUpdate({ member: Target.user.id }, { Premium: false });
                    }
                }
            }
        }
    }
}