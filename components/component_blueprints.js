const { ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js')

module.exports.modal = title => id => new ModalBuilder()
  .setCustomId(id)
  .setTitle(title)

module.exports.input = label => id => style => placeholder => new TextInputBuilder()
  .setCustomId(id)
  .setLabel(label)
  .setStyle(style)
  .setPlaceholder(placeholder)

module.exports.actionRow = component => new ActionRowBuilder().addComponents(component)

module.exports.simpleEmbed = title => description => new EmbedBuilder()
  .setTitle(title)
  .setDescription(description)
// we just call it and bind the rest of the methods to it.
//
module.exports.blacklistEmbed = (username) => (fields) => (msg) => this.simpleEmbed('Blacklisted Words')(`Shows ${msg} Blacklisted Words.`).setAuthor({ name: username }).addFields({ name: 'Blacklist', value: fields })
