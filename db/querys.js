const { db } = require('./database.js')

module.exports.selectUserId = async (interactionUserId) => await db().query('SELECT "id" FROM "users" WHERE "id" = $1', [interactionUserId])

module.exports.selectServerId = async (serverId) => await db().query('SELECT "server_id" from "registered_servers" WHERE "server_id" = $1', [serverId])

module.exports.insertIntoUserServers = async (userId, serverId) => await db().query('INSERT INTO "user_servers"("user_id", "server_id") VALUES ($1, $2)', [userId, serverId])

module.exports.insertIntoUsers = async (username, userId) => await db().query('INSERT INTO "users"("username", "id") VALUES ($1, $2)', [username, userId])

module.exports.insertIntoRegisteredServers = async (serverId) => await db().query('INSERT INTO "registered_servers"("server_id") VALUES ($1)', [serverId])
