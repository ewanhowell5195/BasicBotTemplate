export default (message, args) => {
  if (args.content || args.embedless) {
    return message.edit({
      allowedMentions: { parse: ["users"] },
      content: args.content,
      embeds: [],
      files: args.files,
      components: args.components
    }).catch(() => {})
  }
  if (args.embeds) {
    return message.edit({
      allowedMentions: { parse: ["users"] },
      content: args.message,
      embeds: args.embeds.map(e => makeEmbed(e)),
      files: args.files,
      components: args.components
    }).catch(() => {})
  }
  return message.edit({
    allowedMentions: { parse: ["users"] },
    content: args.message,
    embeds: [makeEmbed(args)],
    files: args.files,
    components: args.components
  }).catch(() => {})
}