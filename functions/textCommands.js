const { PermissionFlagsBits } = require('discord.js')
const { db } = require('../db/database.js')

const warnFunc = async (user, message, channelMsg) => {
  const getWarnedUser = await db().query('SELECT "warneduser_id" FROM "warned_id" WHERE "warneduser_id" = $1', [user.id])
  const getServersWithUser = await db().query('SELECT "serverid" FROM "warned_in_servers" WHERE "warneduser_id" = $1', [user.id])
  const currentNumberOfWarns = await db().query('SELECT "warn_num" FROM "warned_in_servers" WHERE "warneduser_id" = $1', [user.id])
  if (getWarnedUser.rows.length === 0 && getServersWithUser.rows.length === 0) {
    await db().query('INSERT INTO "warned_id"("warneduser_id") VALUES ($1)', [user.id])
    await db().query('INSERT INTO "warned_in_servers"("warneduser_id", "serverid", warn_num) VALUES ($1, $2, $3)', [user.id, message.guild.id, 1])
    message.channel.send('User and server added to warn list.')
  } else if (getWarnedUser.rows.length > 0 && getServersWithUser.rows.length === 0) {
    await db().query('INSERT INTO "warned_in_servers"("warneduser_id", "serverid", warn_num) VALUES ($1, $2, $3)', [user.id, message.guild.id, 1])
    message.channel.send('User and server added to warn list.')
  } else if (getWarnedUser.rows.length > 0 && getServersWithUser.rows.length > 0) {
    await db().query('UPDATE "warned_in_servers" SET "warn_num" = "warn_num" + 1 WHERE "warneduser_id" = $1 AND "serverid" = $2', [user.id, message.guild.id])
    console.log(currentNumberOfWarns.rows[0].warn_num)
    message.channel.send(`User ${user} ${channelMsg} (${currentNumberOfWarns.rows[0].warn_num})!`)
    if (currentNumberOfWarns.rows[0].warn_num >= 3) {
      user.kick()
      message.channel.send(`After 3 warnings ${user} has been kicked!`)
    }
  }
}

const textCommandBuilder1 = (channelMsg) => (txtCommandName) => async (message) => {
  try {
    const command = message.content.toLowerCase()
    const member = message.mentions.users.first()
    // console.log(member.id) // this works so why use cache get? wtf was i doing i too lazy to refactor now tho.
    if (command === `!${txtCommandName} ${member}`) {
      const user = message.guild.members.cache.get(member.id)
      if (user && !user.permissions.has(PermissionFlagsBits.Administrator)) {
        switch (txtCommandName) {
          case 'kick':
            await user.kick()
            message.channel.send(`User ${user} ${channelMsg}!`)
            break
          case 'ban':
            await user.ban()
            message.channel.send(`User ${user} ${channelMsg}!`)
            break
          case 'warn': {
            await warnFunc(user, message, channelMsg)
            break
          }
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports.kick = textCommandBuilder1('kicked')('kick')
module.exports.ban = textCommandBuilder1('banned')('ban')
module.exports.manualWarn = textCommandBuilder1('has been warned')('warn')
