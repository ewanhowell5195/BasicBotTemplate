export default args => {
  const embed = new Discord.EmbedBuilder()
  if (args.title) embed.setTitle(args.title)
  if (args.description) embed.setDescription(args.description)
  if (args.author) embed.setAuthor(args.author)
  if (args.footer) embed.setFooter(args.footer)
  if (args.thumbnail) embed.setThumbnail(args.thumbnail)
  if (args.image) embed.setImage(args.image)
  if (args.timestamp) embed.setTimestamp(args.timestamp)
  embed.setColor(args.color ?? "#FFFFFF")
  return embed
}