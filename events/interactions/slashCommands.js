const Discord = require('discord.js');
const { asegurar_todo } = require('../../functions/security');

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if(!interaction.isCommand()) return;
        const slashcmds = client.slashcommands.get(interaction.commandName)

        if(!slashcmds) return;

        try{
            await slashcmds.run(client, interaction);
        } catch(e) {
            console.error(e);
        } 
    }
}