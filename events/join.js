const { Events } = require('discord.js')
const { db } = require('../db/database.js')

module.exports = {
  name: Events.GuildDelete,
  async execute (client) {
    console.log(client.id)

    await db().query('DELETE FROM "blacklisted_words" WHERE "server_id" = $1', [client.id])
    await db().query('DELETE FROM "user_servers" WHERE "server_id" = $1', [client.id])
    await db().query('DELETE FROM "registered_servers" WHERE "server_id" = $1', [client.id])
  }
}
