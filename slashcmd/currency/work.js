const { SlashCommandBuilder } = require('@discordjs/builders');
const ecoSchema = require('../../schemas/currency/currencySchema');
const userSchema = require('../../schemas/users/userSchema');
const duration = require('humanize-duration');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Genera dinero para comprar materiales'),
    async run(client, interaction){
        let dato = await ecoSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id });
        let datos = await userSchema.findOne({ member: interaction.user.id });
        let tiempo_ms = 3 * 60 * 60 * 1000;
        if(tiempo_ms - (Date.now() - dato.TimeoutWork) > 0) {
            let tiempo_restante = duration(Date.now() - dato.TimeoutWork - tiempo_ms,
            {
                language: "es",
                units: ["h", "m", "s"],
                round: true,
            })
            
            return await interaction.reply(`🕑 - Tienes que esperar \`${tiempo_restante}\` para volver a trabajar`);
        }
        let recompensa = Math.floor(Math.random() * 800) + 200;
        let patoTotal = recompensa + datos.PagoExtra;

        var jobs = [
            "programador",
            "mecánico",
            "chofer privado"
        ];
        let trabajo = jobs[Math.floor(Math.random() * jobs.length)]; 

        switch(datos.Premium){
            case true: {
                await ecoSchema.findOneAndUpdate({ GuildID: interaction.guild.id, UserID: interaction.user.id }, {
                    GuildID: interaction.guild.id,
                    UserID: interaction.user.id,
                    $inc: {
                        Money: recompensa + datos.PagoExtra
                    },
                    TimeoutWork: Date.now(),
                });
        
                return interaction.reply({ content: `<a:coin_moneda:956777023722889216> | Trabajaste como ${trabajo} y generaste **+$${recompensa}** + **${datos.PagoExtra}**.\nTotal: ${patoTotal}.` });
            }
            case false: {
                await ecoSchema.findOneAndUpdate({ GuildID: interaction.guild.id, UserID: interaction.user.id }, {
                    GuildID: interaction.guild.id,
                    UserID: interaction.user.id,
                    $inc: {
                        Money: recompensa
                    },
                        TimeoutWork: Date.now(),
                });
            
                return interaction.reply({ content: `Trabajaste como ${trabajo} y generaste **+$${recompensa}**.` });
            }
        }
    } 
}