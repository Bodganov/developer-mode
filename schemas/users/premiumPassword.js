const { model, Schema } = require('mongoose');

const clavePremium = Schema({
    clave: String,
    duracion: String,
    activo: { type: Boolean, default: false }
});

module.exports = model('clave_premium', clavePremium);