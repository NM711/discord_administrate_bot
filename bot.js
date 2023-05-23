require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Client, Collection, GatewayIntentBits } = require('discord.js')
const { runDatabase } = require('./db/database.js')

runDatabase()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
})

client.commands = new Collection()
// Joining current dir with the commands dir
const pathToCommandFolder = path.join(__dirname, 'commands')
// All sub directorys within the commands path are read
const pathToCommandSubFolders = fs.readdirSync(pathToCommandFolder)

for (const subFolder of pathToCommandSubFolders) {
// We join the pathToCommandFolder path with the sub folder path
  const subFolderPath = path.join(pathToCommandFolder, subFolder)
// All js files are filtered
  const subFolderCommandFiles = fs.readdirSync(subFolderPath).filter(file => file.endsWith('js'))
  for (const file of subFolderCommandFiles) {
// SubDirPath is joined with the js file in the loop
    const filePath = path.join(subFolderPath, file)
// Command is equal to each unnamed exported module within the js file
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
  }
}

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.login(process.env.TOKEN)
