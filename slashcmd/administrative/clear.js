const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Borra una cantidad de mensajes")
    .addNumberOption(option => option.setName("cantidad").setDescription("Borra una cantidad de mensajes").setRequired(true))
    .addUserOption(option => option.setName("target").setDescription("Selecciona un usuario para borrar sus mensajes").setRequired(false)),
	async run(client, interaction){
        const cantidad = interaction.options.getNumber("cantidad");
        const usuario = interaction.options.getMember("target");

        if(cantidad < 0) return interaction.reply({ content: "La cantidad debe ser un numero positivo", ephemeral: true });
        if(cantidad > 100) return interaction.reply({ content: "No puedo eliminar mas de 100 mensajes", ephemeral: true });

        const mensajes = await interaction.channel.messages.fetch();

        const response = new MessageEmbed()
        .setColor('PURPLE');

        if(usuario){
            let i = 0;
            const filtered = [];
            (await mensajes).filter((m) =>{
                if(m.author.id === usuario.id && cantidad > i){
                    filtered.push(m);
                    i++;
                }
            });

            await interaction.channel.bulkDelete(filtered, true).then(messages => {
                response.setDescription(`Mensajes eliminados: ${messages.size} de ${usuario}`);

                interaction.reply({ embeds: [response] });
            })
        } else {
            await interaction.channel.bulkDelete(cantidad, true).then(messages => {
                response.setDescription(`Mensajes eliminados: ${messages.size} del canal`);

                interaction.reply({ embeds: [response] });
            })
        }
	}
}