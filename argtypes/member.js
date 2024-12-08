export default async (item, message, args) => {
  item = item.toLowerCase()
  let member
  if (item === "<<") {
    member = createMember(message.author)
  } else if (["self", "<", "me"].includes(item)) {
    member = message.member
  } else if (item === "bot") {
    member = message.guild?.members.me ?? createMember(client.user)
  } else if (item === "^") {
    try {
      const messages = Array.from(await message.channel.messages.fetch({ before: message.id, limit: 1 }))
      if (messages[0]?.[1].member) {
        member = messages[0][1].member
      }
    } catch {}
  }
  if (!member) {
    const id = item.replace(/\D+/g, "")
    if (message.guild) {
      member = await getMember(message.guild, id)
      if (!member) {
        try {
          if (item.startsWith("@")) item = item.slice(1)
          const parts = item.match(/(.+?)(#\d{4}$)?$/)
          const members = await message.guild.members.search({ query: parts[1] })
          const found = members.find(member => member.user.username.toLowerCase() === item || member.user.globalName.toLowerCase() === item || member.nickname?.toLowerCase() === item)
          if (found) member = found
        } catch {}
      }
    } else {
      let user
      if (id === client.user.id || item === client.user.username || item === client.user.globalName) {
        user = client.user
      } else if (id === message.author.id || item === message.author.username) {
        user = message.author
      }
      if (user) {
        member = createMember(user)
      }
    }
  }
  if (!member) {
    let user
    try {
      user = await client.users.fetch(id)
    } catch {
      const ban = (await message.guild.bans.fetch()).find(e => e.user.username.toLowerCase() === item)
      if (ban) {
        user = ban.user
      }
    }
    if (user) {
      member = createMember(user)
    }
  }
  if (!member) {
    return sendError(message, {
      title: "User not found",
      description: `The user ${item.limit().quote()} could not be found`
    })
  }
  if (args.self === false && member.id === message.author.id) {
    return sendError(message, {
      title: `Unsupported member for ${args.name.quote()}`,
      description: "You cannot select yourself"
    })
  }
  return member
}