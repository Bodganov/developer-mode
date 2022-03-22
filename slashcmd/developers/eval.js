const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ID_Owners } = require('../../functions/configurations/ownersIds.json');
const { inspect } = require('util');

module.exports = {
	data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evalua un codigo")
    .addStringOption(string => string.setName('evaluo').setDescription('El codigo que se evaluara').setRequired(true)),
	async run(client, interaction){
        if(!ID_Owners.includes(interaction.user.id)) return interaction.reply({ content: "No puedes usar este comando", ephemeral: true });

        const args = interaction.options.getString('evaluo');

        try {
            const evaluando = await eval(args);
            const truncado = truncar(inspect(evaluando), 2045);

            interaction.reply({ embeds: 
                [
                    new MessageEmbed()
                    .setTitle('Evaluacion')
                    .setDescription(`\`\`\`js\n${truncado}\`\`\``)
                    .setColor('PURPLE')
                    .setTimestamp()
                ]
            })
        } catch(e) {
            interaction.reply({ embeds: 
                [
                    new MessageEmbed()
                    .setTitle('Evaluacion')
                    .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                    .setColor('PURPLE')
                    .setTimestamp()
                ]
            })
        }
	}
}

function truncar(texto, n){
    if(texto.length > n){
        return texto.substring(0, n) + "..."
    } else {
        return texto;
    }
}