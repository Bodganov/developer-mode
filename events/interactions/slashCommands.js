const { CollectPremium } = require('../../functions/configurations/collectPremium');
const { asegurar_todo } = require('../../functions/security');

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if(!interaction.isCommand()) return;
        
        await asegurar_todo(interaction.guild.id, interaction.user.id);
        await CollectPremium(interaction.user.id);

        const slashcmds = client.slashcommands.get(interaction.commandName)
        if(!slashcmds) return;
        try{
            await slashcmds.run(client, interaction);
        } catch(e) {
            console.error(e);
        } 
    }
}