const { model, Schema } = require('mongoose');

const serverModel = Schema({
    GuildID: String,
    levelsSetup: { type: Boolean, default: true },
    economiaSetup: { type: Boolean, default: true }
});

module.exports = model('server_configDB', serverModel);