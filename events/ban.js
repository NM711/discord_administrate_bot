const { Events, PermissionFlagsBits } = require('discord.js')
const { ban } = require('../functions/textCommands.js')

module.exports = {
  name: Events.MessageCreate,
  async execute (message) {
    if (message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await ban(message)
    }
  }
}
