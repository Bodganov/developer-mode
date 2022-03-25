const { model, Schema } = require('mongoose');

const setupCurrency = Schema({
    GuildID: String,
    UserID: String,
    Money: { type: Number, default: 1000 },
    Bank: { type: Number, default: 0 },
    TimeoutDaily: String,
    TimeoutWork: String,
});

module.exports = model('CurrencySetup', setupCurrency);