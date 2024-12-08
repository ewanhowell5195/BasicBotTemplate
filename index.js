import { pathToFileURL } from "url"
import Discord from "discord.js"
import path from "node:path"
import fs from "node:fs"

//////////////////////////////////////////////////////////////////////////////////////
// Global Imports - Imports you want to use globally
//////////////////////////////////////////////////////////////////////////////////////

const constants = {
  Discord
}

for (const [k, v] of Object.entries(constants)) {
  globalThis[k] = v
}

//////////////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////////////

const getFiles = async function*(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////
// Prototypes
//////////////////////////////////////////////////////////////////////////////////////

String.prototype.limit = function(l = 128, i) {
  if (this.length <= l) return this
  if (i) return "…" + this.slice(-(l - 1)).trim()
  return this.slice(0, l - 1).trim() + "…"
}
String.prototype.quote = function(c, lang = "") {
  if (c) return `\`\`\`${lang}
${this.replaceAll("`", "´")}\`\`\``
  return `\`${this.replaceAll("`", "´")}\``
}
Number.prototype.quote = function(c, lang = "") {
  if (c) return `\`\`\`${lang}
${this.toLocaleString()}\`\`\``
  return `\`${this.toLocaleString()}\``
}

//////////////////////////////////////////////////////////////////////////////////////
// Client
//////////////////////////////////////////////////////////////////////////////////////

globalThis.client = new Discord.Client({
  shards: "auto",
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildBans",
    "GuildEmojisAndStickers",
    // "GuildIntegrations",
    // "GuildWebhooks",
    "GuildInvites",
    "GuildVoiceStates",
    "GuildPresences",
    "GuildMessages",
    "GuildMessageReactions",
    // "GuildMessageTyping",
    "DirectMessages",
    // "DirectMessageReactions",
    // "DirectMessageTyping",
    "MessageContent",
    // "GuildScheduledEvents",
  ].map(e => Discord.GatewayIntentBits[e]),
  partials: [
    "User",
    "Channel",
    "GuildMember",
    "Message",
    "Reaction",
    // "GuildScheduledEvent",
    "ThreadMember"
  ].map(e => Discord.Partials[e])
})

client.commands = new Discord.Collection

//////////////////////////////////////////////////////////////////////////////////////
// Function Loading
//////////////////////////////////////////////////////////////////////////////////////

for await (const f of getFiles("./functions")) {
  const func = (await import(pathToFileURL(f).href)).default
  if (typeof func === "function") {
    globalThis[path.basename(f, ".js")] = func
  } else {
    for (const [k, v] of Object.entries(func)) {
      globalThis[k] = v
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////
// ArgType Loading
//////////////////////////////////////////////////////////////////////////////////////

globalThis.argTypes = {}

for await (const f of getFiles("./argtypes")) {
  argTypes[path.basename(f, ".js")] = (await import(pathToFileURL(f).href)).default
}

//////////////////////////////////////////////////////////////////////////////////////
// Event Loading
//////////////////////////////////////////////////////////////////////////////////////

for await (const f of getFiles("./events")) {
  const event = (await import(pathToFileURL(f).href)).default
  const func = (...args) => {
    if (client.isReady()) event(...args)
  }
  client.on(path.basename(f, ".js"), func)
}

//////////////////////////////////////////////////////////////////////////////////////
// Command Loading
//////////////////////////////////////////////////////////////////////////////////////

for await (const f of getFiles("./commands")) {
  const command = (await import(pathToFileURL(f).href)).default
  const name = path.basename(f, ".js")
  command.name = name
  if (command.arguments) {
    for (const argument of command.arguments) {
      argument.type ??= "string"
      argument.name ??= argument.type
    }
  }
  if (client.commands.get(name)) {
    throw new Error(`Command "${name}" already exists`)
  }
  client.commands.set(name, command)
  if (command.aliases) {
    for (const alias of command.aliases) {
      if (client.commands.get(alias)) {
        throw new Error(`Command "${alias}" already exists`)
      }
      client.commands.set(alias, command)
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////
// Login
//////////////////////////////////////////////////////////////////////////////////////

client.login(process.env.TOKEN)