module.exports = {
    name: 'ready',
    run: (client, message) => {
        console.log(`Load correctly as ${client.user.tag} - ID: ${client.user.id}`.green)
    }
}