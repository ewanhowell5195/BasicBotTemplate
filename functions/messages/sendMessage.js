async function send(message, processing, content) {
  if (processing) {
    try {
      return await processing.edit(content)
    } catch {}
  }
  if (message instanceof Discord.Message) {
    try {
      return await message.reply(content)
    } catch {}
  }
  const channel = message.channel ?? message
  return channel.send(content)
}

export default {
  async sendMessage(message, args) {
    if (args.content || args.embedless) {
      return send(message, args.processing, {
        allowedMentions: { parse: ["users"] },
        content: args.content,
        embeds: [],
        files: args.files,
        components: args.components,
        ephemeral: args.ephemeral
      })
    }
    if (args.embeds) {
      return send(message, args.processing, {
        allowedMentions: { parse: ["users"] },
        content: args.message,
        embeds: args.embeds.map(e => makeEmbed(e)),
        files: args.files,
        components: args.components,
        ephemeral: args.ephemeral
      })
    }
    return send(message, args.processing, {
      allowedMentions: { parse: ["users"] },
      content: args.message,
      embeds: [makeEmbed(args)],
      files: args.files,
      components: args.components,
      ephemeral: args.ephemeral
    })
  },
  sendError(message, args) {
    args.colour = "#FF0000"
    args.author = { name: "Error" }
    return sendMessage(message, args)
  }
}