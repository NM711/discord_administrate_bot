const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { db } = require('../../db/database.js')
const { updateDB } = require('../../functions/updateDB.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove_word')
    .setDescription('removes word from blacklist.')
    .addStringOption(option => option.setName('word').setDescription('Removes word from blacklist'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute (interaction) {
    const inputWord = interaction.options.getString('word')
    const getUser = await db().query('SELECT "user_id", "server_id" FROM "user_servers" WHERE "user_id" = $1 AND "server_id" = $2', [interaction.user.id, interaction.guild.id])
    if (getUser.rows.length > 0) {
      const blacklist = await db().query('SELECT "word" FROM "blacklisted_words" WHERE "user_id" = $1 AND "server_id" = $2', [interaction.user.id, interaction.guild.id])
      // To string just in case there is numbers
      const wordToRemove = [...blacklist.rows].find(prop => prop.word === inputWord)
      console.log(wordToRemove)
      if (wordToRemove) {
        await db().query('DELETE FROM "blacklisted_words" WHERE "word" = $1 AND "server_id" = $2', [wordToRemove.word, interaction.guild.id])
        await updateDB(interaction)
        await interaction.reply({ content: `Successfully removed "${wordToRemove.word}"`, ephemeral: true })
      } else {
        await interaction.reply({ content: 'Could not find word please check your blacklist and try again. (/my_blacklist)', ephemeral: true })
      }
    } else {
      await interaction.reply({ content: 'Could not find an id, are you registered yet? (/register)', ephemeral: true })
    }
  }
}
