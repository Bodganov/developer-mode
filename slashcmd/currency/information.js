const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ecoSchema = require('../../schemas/currency/currencySchema');
const userSchema = require('../../schemas/users/userSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('info-economia')
    .setDescription('Mira tu balance economico')
    .addStringOption(tipoInfo => 
        tipoInfo
            .setName('informacion')
            .setDescription('Mira la informacion solicitada')
            .addChoice('Balance economico', 'balance')
            .addChoice('Perfil', 'profile')
            .setRequired(true))
    .addUserOption(userOption => 
        userOption
            .setName('target')
            .setDescription('Informacion de otro usuario')),
    async run(client, interaction){
        const member = interaction.options.getMember("target") || interaction.member;
        if(member.user.bot) return interaction.reply({ content: "Los bots no tiene informacion en este sistema", ephemeral: true });

        let dato = await ecoSchema.findOne({ GuildID: interaction.guild.id, UserID: member.user.id });
        if(!dato) return interaction.reply({ content: "Este usuario no esta registrado en la base de datos.", ephemeral: true });
        let datos = await userSchema.findOne({ member: member.user.id });

        switch(interaction.options.getString('informacion')){
            case "balance": {
                let bank = dato.Bank;
                let money = dato.Money;
                let total = bank + money;
                var comaBank = (bank) => String(bank).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                var comaMoney = (money) => String(money).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                var comaTotal = (total) => String(total).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                await interaction.reply({ embeds: 
                    [
                        new MessageEmbed()
                        .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true}) })
                        .addFields(
                            {
                                name: 'Dinero',
                                value: `\`${comaMoney(money)}\``,
                                inline: true
                            },
                            {
                                name: 'Banco',
                                value: `\`${comaBank(bank)}\``,
                                inline: true
                            },
                            {
                                name: 'Total',
                                value: `\`${comaTotal(total)}\``,
                                inline: true
                            }
                        )
                        .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
                    ]
                });
            }
            break;
            case "profile": {
                const embed = new MessageEmbed()
                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true}) })
                .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor);

                if(member.nickname !== null){
                    embed.addField('Apodo', `${member.nickname}`, true)
                }

                if(datos.Premium <= Date.now()){
                    embed.addField('Premium', '❎', true)
                } else {
                    embed.addField('Premium', '✅', true)
                    embed.addField('Pago Extra Premium', `$${datos.PagoExtra}`, true)
                }
                    
                await interaction.reply({ embeds: [embed] })
            }
        }
    }
}