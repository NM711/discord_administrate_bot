const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { blacklistForm } = require('../../components/form.js')
const { selectServerId } = require('../../db/querys.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add_to_blacklist')
    .setDescription('Sets words which will result in mute.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute (interaction) {
    const regServer = await selectServerId(interaction.guild.id)
    return regServer.rows.length > 0
      ? (await interaction.showModal(blacklistForm))
      : (await interaction.reply({ content: `${interaction.user} You need to register the server before performing this action!`, ephemeral: true }))
  }
}
