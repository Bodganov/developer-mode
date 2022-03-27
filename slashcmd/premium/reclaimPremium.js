const { SlashCommandBuilder } = require('@discordjs/builders');
const key_schema = require('../../schemas/users/premiumPassword');
const ecoUser = require('../../schemas/users/userSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Reclama tu suscripcion premium')
    .addStringOption(key =>
        key
            .setName('clave')
            .setDescription('Escribe la clave para tu suscripcion premium')
            .setRequired(true)),
    async run(client, interaction){
        const keyP = interaction.options.getString('clave');
        const keyAdv = await key_schema.findOne({ clave: keyP });
        
        if(keyAdv){
            if(keyP.activado){
                return interaction.reply({ content: `Esa clave ya esta siendo usada`, ephemeral: true });
            } else {
                keyAdv.activado = true;
                keyAdv.save();

                await ecoUser.findOneAndUpdate({ member: interaction.user.id }, {
                    Premium: Math.round(Date.now() + Number(keyAdv.duracion))
                });
                return interaction.reply({ content: `Se activo la clave premium\nExpira en: <t:${Math.round((Date.now() + Number(keyAdv.duracion)) / 1000)}:R> `, ephemeral: true })
            }
        } else {
            return interaction.reply({ content: `No se encontro la clave`, ephemeral: true })
        }
    }
}