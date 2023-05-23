const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { db } = require('../../db/database.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('user_warns')
    .setDescription('See the number of warns a user has on this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers || PermissionFlagsBits.BanMembers)
    .addUserOption(y => y.setName('user').setDescription('Gets a user.').setRequired(true)),
  async execute (interaction) {
    const getUser = interaction.options.getUser('user')
    const userId = getUser.id
    const getWarnedNum = await db().query('SELECT "warn_num" FROM "warned_in_servers" WHERE "warneduser_id" = $1 AND "serverid" = $2', [userId, interaction.guild.id])

    if (getWarnedNum.rows.length > 0) {
      await interaction.reply({ content: `User ${getUser} has ${getWarnedNum.rows[0].warn_num} warns on this server!`, ephemeral: true })
    } else await interaction.reply({ content: `${getUser} does not have any warnings on this server!`, ephemeral: true })
  }
}
