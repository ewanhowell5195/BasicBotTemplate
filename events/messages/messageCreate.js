const prefix = "!"

export default async message => {
  if (message.author.bot || !message.content) return
  if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
    return sendMessage(message, {
      title: client.user.displayName,
      thumbnail: avatar(client.user),
      description: `My prefix is \`${prefix}\``
    })
  }
  let messageList = message.content.split(/(?<! ) /)
  if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(messageList[0])) {
    messageList[0] = prefix + (messageList[1] ?? "")
    messageList.splice(1, 1)
  }
  const start = messageList[0].toLowerCase()
  if (start.startsWith(prefix)) {
    const command = start.slice(prefix.length)
    if (command === "") return
    const cmd = client.commands.get(command)
    if (!cmd) {
      return sendError(message, {
        title: "Command not found",
        description: `The command ${command.limit().quote()} was not found`
      })
    }
    message.aliasUsed = command
    runCommand(cmd, message, messageList.slice(1))
  }
}