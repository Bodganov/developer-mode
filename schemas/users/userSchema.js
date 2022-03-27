const { model, Schema } = require('mongoose');

const modelo_user = Schema({
    member: String,
    Premium: { type: String, default: '' },
    PagoExtra: { type: Number, default: 100 },
    duration_p: String
});

module.exports = model('users_esquema', modelo_user);