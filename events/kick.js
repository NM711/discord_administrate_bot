const { Events, PermissionFlagsBits } = require('discord.js')
const { kick } = require('../functions/textCommands.js')

module.exports = {
  name: Events.MessageCreate,
  async execute (message) {
    if (message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      await kick(message)
    }
  }
}
