const { TextInputStyle } = require('discord.js')
const { modal, input, actionRow } = require('./component_blueprints.js')
const placeholder = 'Enter Blacklisted Word'
// Refactor Later
const inputWordOne = input('First Word')('word_#1')(TextInputStyle.Short)(placeholder)

module.exports.blacklistForm = modal('Words to Blacklist')('word_blacklister').addComponents(actionRow(inputWordOne))
