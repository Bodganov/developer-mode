const model_server = require('../../schemas/server/serverSchema');

module.exports = {
    CollectServer
}

async function CollectServer(serverid){
    if(serverid){
        let dato = await model_server.findOne({ GuildID: serverid });
        if(!dato){
            console.log(`Datos del servidor ${serverid} guardados (Setup Server)`)
            dato = await new model_server({
                GuildID: serverid,
                levelsSetup: true,
                economiaSetup: true
            });
            dato.save();
        }
    }
}