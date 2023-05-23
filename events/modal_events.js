const { Events } = require('discord.js')
const { db } = require('../db/database.js')
const { selectUserId } = require('../db/querys.js')
const { updateDB } = require('../functions/updateDB.js')
module.exports = {
  name: Events.InteractionCreate,
  async execute (interaction) {
    if (!interaction.isModalSubmit()) return
    if (interaction.customId === 'word_blacklister') {
      const word = interaction.fields.getTextInputValue('word_#1')
      const getUserId = await selectUserId(interaction.user.id)
      if (getUserId.rows.length > 0) {
        const serverId = interaction.guild.id
        const id = getUserId.rows[0].id
        await db().query('INSERT INTO "blacklisted_words"("word", "user_id", "server_id") VALUES ($1, $2, $3)', [word, id, serverId])
        await updateDB(interaction)
        await interaction.reply({ content: 'Word Blacklisted!', ephemeral: true })
      } else {
        await interaction.reply('Could not find an id, are you registered yet? (/register)')
      }
      // make it so that the add_to_blacklist command only appears for registered users
    }
  }
}
