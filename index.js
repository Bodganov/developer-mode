require('dotenv').config();
require('colors');
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: process.env.token });

manager.on('shardCreate', shard => console.log(`Shard: ${shard.id} iniciado`.yellow));
manager.spawn();