async function get(thing, id) {
  if (!id || id.length > 19) return
  const got = await thing?.fetch(id).catch(() => {})
  if (got instanceof Discord.Collection) return
  return got
}

export default {
  getChannel: (id, guild) => get(guild?.channels ?? client.channels, id),
  getGuild: id => get(client.guilds, id),
  getMember: (guild, id) => get(guild.members, id),
  getMessage: (channel, id, force) => get(channel.messages, { message: id, force }),
  getUser: id => get(client.users, id),
  getRole: (guild, id) => get(guild.roles, id),
  getGuildEmoji: (guild, id) => get(guild.emojis, id)
}