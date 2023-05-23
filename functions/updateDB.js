const { PermissionFlagsBits } = require('discord.js')
const { db } = require('../db/database.js')
// its all eating off the same fucking array FUCK FUCK FUCK, FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCKKKKK
module.exports.guildBlacklistedWords = []

module.exports.updateDB = async (interaction) => {
  try {
    this.guildBlacklistedWords.length = 0
    const guildId = interaction.guild.id
    const guildInfo = await interaction.guild.fetch(guildId)
    const guildMembers = await guildInfo.members.fetch()
    const admins = guildMembers.filter(m => m.permissions.has(PermissionFlagsBits.Administrator) === true)
    const adminIds = admins.map(a => a.id)
    console.log(adminIds)
    // for (const id of adminIds) {
    // console.log(id)
    const words = await db().query('SELECT "word", "server_id" FROM "blacklisted_words"')
    console.log(words.rows.flat())
    if (words.rows.length > 0) {
      this.guildBlacklistedWords.push(words.rows)
    }
  // }
  } catch (err) {
    console.log('ERR UPDATE DB FUNC:', err)
  }
}
