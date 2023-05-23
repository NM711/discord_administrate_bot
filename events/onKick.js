const { Events } = require('discord.js')
const { db } = require('../db/database.js')

module.exports = {
  name: Events.GuildMemberRemove,
  async execute (member) {
    await db().query('DELETE FROM "warned_in_servers" WHERE "warneduser_id" = $1 AND "serverid" = $2', [member.id, member.guild.id])
    await db().query('DELETE FROM "warned_id" WHERE "warneduser_id" = $1', [member.id])
    await db().query('DELETE FROM "user_servers" WHERE "user_id" = $1 AND "server_id" = $2', [member.id, member.guild.id])
    await db().query('DELETE FROM "blacklisted_words" WHERE "user_id" = $1 AND "server_id" = $2', [member.id, member.guild.id])
    console.log(`User id ${member.id} removed from table`)
  }
}
