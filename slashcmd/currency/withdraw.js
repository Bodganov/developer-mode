const { SlashCommandBuilder } = require('@discordjs/builders');
const ecoSchema = require('../../schemas/currency/currencySchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('retirar')
    .setDescription('Retirar todo tu dinero')
    .addSubcommand(SubCmd =>
        SubCmd
            .setName('cantidad')
            .setDescription('Retirar una cantidad exacta de dinero')
            .addNumberOption(cantidadO => 
                cantidadO
                    .setName('amount')
                    .setDescription('Escribe la cantidad')
                    .setRequired(true)))
    .addSubcommand(SubCmd2 => 
        SubCmd2
            .setName('todo')
            .setDescription('Retira todo tu dinero')),
    async run(client, interaction){
        let dato = await ecoSchema.findOne({ GuildID: interaction.guild.id, UserID: interaction.user.id })
        switch(interaction.options.getSubcommand()){
            case "todo": {
                if(dato.Bank === 0) return interaction.reply({ content: "No tienes dinero para retirar", ephemeral: true });

                let cantidad = dato.Bank;
                var comaTotalAll = (cantidad) => String(cantidad).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                await ecoSchema.findOneAndUpdate({ GuildID: interaction.guild.id, UserID: interaction.user.id }, {
                   $inc: {
                       Money: cantidad,
                       Bank: -cantidad
                   }
                });

                return interaction.reply({ content: `<a:coin_moneda:956777023722889216> | Cantidad retirada: $**${comaTotalAll(cantidad)}**` })
            }
            case "cantidad": {
                const Amount = interaction.options.getNumber('amount');

                if(Amount <= 0 || Amount % 1 != 0) return interaction.reply({ content: "La cantidad debe ser positiva", ephemeral: true });
                if(Amount > dato.Bank) return interaction.reply({ content: "No tienes esa cantidad para retirar", ephemeral: true });
                var comaTotalCant = (Amount) => String(Amount).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                await ecoSchema.findOneAndUpdate({ GuildID: interaction.guild.id, UserID: interaction.user.id }, {
                    $inc: {
                        Money: Amount,
                        Bank: -Amount
                    }
                 });

                 return interaction.reply({ content: `<a:coin_moneda:956777023722889216> | Cantidad retirada: $**${comaTotalCant(Amount)}**` })
            }
        }
    }
}