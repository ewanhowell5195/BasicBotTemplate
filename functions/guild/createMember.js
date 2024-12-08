export default user => {
  const member = new Discord.GuildMember
  member.user = user
  Object.defineProperty(member, "displayName", {
    value: user.displayName
  })
  Object.defineProperty(member, "displayColor", {
    value: 0
  })
  return member
}