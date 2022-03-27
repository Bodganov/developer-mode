const { CollectPremium } = require('../../functions/configurations/collectPremium');
const { CollectServer } = require('../../functions/configurations/collectionServer');
const { asegurar_todo } = require('../../functions/security');
const userSchema = require('../../schemas/users/premiumPassword');

module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if(!interaction.isCommand()) return;

        await asegurar_todo(interaction.guild.id, interaction.user.id);
        await CollectPremium(interaction.user.id);
        await CollectServer(interaction.guild.id);

        const slashcmds = client.slashcommands.get(interaction.commandName)
        if(!slashcmds) return;
        try{
            await slashcmds.run(client, interaction);
        } catch(e) {
            console.error(e);
        } 
    }
}