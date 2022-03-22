module.exports = {
    name: 'messageCreate',
    run: async(message) => {
        if(!message.guild || message.author.bot) return;
        if(!message.embeds || !message.embeds[0] || message.embeds.some(e => e.type != "rich")) return; //significa que un usuario normal ha enviando un EMBED cosa que no se puede si no eres un bot
        message.delete().catch(() => {});
        message.channel.send(`${message.author}, No Selfbots!`).catch(() => {});
    }
}