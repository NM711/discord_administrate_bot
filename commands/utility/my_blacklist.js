const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { blacklistEmbed } = require('../../components/component_blueprints.js')
const { db } = require('../../db/database.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my_blacklist')
    .setDescription('Shows all of the words YOU have blacklisted.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute (interaction) {
    const getUser = await db().query('SELECT * FROM "user_servers" WHERE "user_id" = $1 AND "server_id" = $2', [interaction.user.id, interaction.guild.id])
    if (getUser.rows.length > 0) {
      const guildId = getUser.rows[0].server_id
      const id = getUser.rows[0].user_id
      const getBlacklist = await db().query('SELECT "word" FROM "blacklisted_words" WHERE "user_id" = $1 AND "server_id" = $2', [id, guildId])
      const words = [...getBlacklist.rows].map((word, i) => `word #${i}: ${word.word}`).join(', ')
      return words ? await interaction.reply({ embeds: [blacklistEmbed(interaction.user.username)(words)('Your')], ephemeral: true }) : await interaction.reply({ embeds: [blacklistEmbed(interaction.user.username)('No Words In Blacklist!')('Your')] })
    } else {
      await interaction.reply('Could not find an id, are you registered yet? (/register)')
    }
  }
}
