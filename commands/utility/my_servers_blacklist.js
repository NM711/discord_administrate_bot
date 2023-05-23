const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { db } = require('../../db/database.js')
const { blacklistEmbed } = require('../../components/component_blueprints.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklisted')
    .setDescription('Gets server blacklisted words.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute (interaction) {
    const server = interaction.guild.id
    const queryServerBlacklist = await db().query('SELECT "word" FROM "blacklisted_words" WHERE "server_id" = $1', [server])
    const allServerWords = [...queryServerBlacklist.rows].map((word, i) => `word #${i}: ${word.word}`).join(', ')
    if (queryServerBlacklist) {
      await interaction.reply({ embeds: [blacklistEmbed(interaction.user.username)(allServerWords)('Server')] })
    } else {
      await interaction.reply({ embeds: [blacklistEmbed(interaction.user.username)('No Blacklisted Words On This Server...')('Server')] })
    }
  }
}
