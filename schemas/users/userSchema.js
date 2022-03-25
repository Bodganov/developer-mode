const { model, Schema } = require('mongoose');

const modelo_user = Schema({
    member: String,
    Premium: { type: Boolean, default: false },
    PagoExtra: { type: Number, default: 100 }
});

module.exports = model('users_esquema', modelo_user);