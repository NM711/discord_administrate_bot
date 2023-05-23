const { SlashCommandBuilder } = require('discord.js')
const { db } = require('../../db/database.js')
const { selectUserId, insertIntoUserServers, insertIntoUsers, insertIntoRegisteredServers } = require('../../db/querys.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registers you as a user on this server, will not work if you are not admin on this server.'),
  async execute (interaction) {
    await interaction.reply({ content: 'Please wait a moment...', ephemeral: true })
    const interactionUserId = interaction.user.id
    const interactionUserUsername = interaction.user.username
    const userId = await selectUserId(interactionUserId)
    const serverId = await db().query('SELECT "server_id" FROM "registered_servers" WHERE "server_id" = ($1)', [interaction.guild.id])
    console.log(userId.rows, serverId.rows)

    if (userId.rows.length > 0 && serverId.rows.length > 0) {
      await interaction.editReply('Already Registered On This Server')
    } else if (userId.rows.length === 0 && serverId.rows.length > 0) {
      // register user when user does not exists and server does

      await insertIntoUsers(interactionUserUsername, interactionUserId)
      await insertIntoUserServers(interactionUserId, interaction.guild.id)
      await interaction.editReply('REGISTERED USER!')
    } else if (userId.rows.length > 0 && serverId.rows.length === 0) {
      // register server when user exists and server does not

      await insertIntoRegisteredServers(interaction.guild.id)
      await insertIntoUserServers(interactionUserId, interaction.guild.id)
      await interaction.editReply('REGISTERED SERVER!')
      console.log('USER ID TRUE SERVER ID FALSE')
    } else if (userId.rows.length === 0 && serverId.rows.length === 0) {
      console.log(`REGISTERED SERVER ${interaction.guild.id} AND USER ${interactionUserId}`)

      await insertIntoUsers(interactionUserUsername, interactionUserId)
      await insertIntoRegisteredServers(interaction.guild.id)
      await insertIntoUserServers(interactionUserId, interaction.guild.id)
      await interaction.editReply('REGISTERED USER AND SERVER!')
    }
  }
}
