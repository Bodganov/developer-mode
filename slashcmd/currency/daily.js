const { SlashCommandBuilder } = require('@discordjs/builders');
const ecoSchema = require('../../schemas/currency/currencySchema');
const userSchema = require('../../schemas/users/userSchema');
const duration = require('humanize-duration');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Recibe tu bonificacion diaria'),
    async run(client, interaction){
        let dato = await ecoSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id });
        let datos = await userSchema.findOne({ member: interaction.user.id });

        let tiempo_ms = 24 * 60 * 60 * 1000;
        if(tiempo_ms - (Date.now() - dato.TimeoutDaily) > 0){
            let tiempo_restante = duration(Date.now() - dato.TimeoutDaily - tiempo_ms, {
                language: 'es',
                units: ['h', 'm', 's'],
                round: true
            });
            return await interaction.reply(`🕑 - Tienes que esperar \`${tiempo_restante}\` para volver a recoger tu recompensa diaria`);
        }

        let recompensa = 2000;

        if(datos.Premium <= Date.now()){
            await ecoSchema.findOneAndUpdate({ member: interaction.user.id }, {
                GuildID: interaction.guild.id,
                UserID: interaction.user.id,
                $inc: {
                    Money: recompensa
                },
                TimeoutDaily: Date.now(),
            });

            return interaction.reply({ content: `<a:coin_moneda:956777023722889216> | Recibiste tu pago diario de $**${recompensa}**\n🏧 | Total: $**${recompensa}**` });
        } else {
            await ecoSchema.findOneAndUpdate({ member: interaction.user.id }, {
                GuildID: interaction.guild.id,
                UserID: interaction.user.id,
                $inc: {
                    Money: recompensa + datos.PagoExtra*2
                },
                TimeoutDaily: Date.now(),
            });

            return interaction.reply({ content: `<a:coin_moneda:956777023722889216> | Recibiste tu pago diario de $**${recompensa}** + $**${datos.PagoExtra*2} __por ser usuario premium__**\n🏧 | Total: $**${recompensa + datos.PagoExtra*2}**` });
        }
    }
}