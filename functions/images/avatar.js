export default (member, size = 1024, args) => {
  if (!member) return `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 6)}.png`
  let url = member.displayAvatarURL({
    extension: getType.image("PNG"),
    forceStatic: args?.static
  })
  if (size) url += `?size=${size}`
  return url
}