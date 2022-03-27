const { SlashCommandBuilder } = require('@discordjs/builders');
const { ID_Owners } = require('../../functions/configurations/ownersIds.json');
const { premium_key } = require('../../functions/premium/generationKey');
const key_schema = require('../../schemas/users/premiumPassword');
const userSchema = require('../../schemas/users/userSchema');
const ms = require('ms');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Agrega una clave premium')
    .addStringOption(data => 
        data
            .setName('fecha')
            .setDescription('Pon el tiempo en que duarara el premium')
            .setRequired(true)),
    async run(client, interaction){
        if(!ID_Owners.includes(interaction.user.id)) return interaction.reply({ content: "No puedes usar este comando", ephemeral: true });

        const fecha = interaction.options.getString('fecha');

        const time = ms(fecha);

        if(time){
            let clave = premium_key();
            interaction.user.send({ embeds: 
                [
                    new MessageEmbed()
                    .setTitle(`New key premium - Create in ${interaction.guild.name}'s server`)
                    .setDescription(`\`\`\`diff\n+ ${clave}\n\`\`\``)
                    .addField(`Create for`, `${interaction.user.tag} - ${interaction.user.id}`)
                    .addField(`Time`, `${fecha}`)
                    .addField(`Status`, `Not Used`)
                    .setColor('GREEN')
                ]
            }).catch(() => {
                return interaction.reply({ content: `Your's DMs not opens`, ephemeral: true });
            });

            let data = new key_schema({
                clave,
                duracion: time,
                activado: false
            });
            data.save();
            return interaction.reply({ content: `New key generate, view your DMs`, ephemeral: true });
        } else {
            return interaction.reply({ content: `Write one time`, ephemeral: true });
        }
    }
}