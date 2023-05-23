const { Events } = require('discord.js')
const { guildBlacklistedWords } = require('../functions/updateDB.js')

module.exports = {
  name: Events.MessageCreate,
  async execute (message) {
    const findWord = guildBlacklistedWords.flat().filter(w => w.word === message.content && w.server_id === message.guild.id)
    if (findWord.length > 0) {
      console.log('WORD FOUND', findWord)
      message.delete()
    }
  }
}
