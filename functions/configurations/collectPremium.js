const model_user = require('../../schemas/users/userSchema');

module.exports = {
    CollectPremium
}

async function CollectPremium(userid){
    if(userid){
        let dato = await model_user.findOne({ member: userid });
        if(!dato){
            console.log(`Datos de ${userid} guardados (Premium)`)
            dato = await new model_user({
                member: userid,
                Premium: false
            });
            dato.save();
        }
    }
}