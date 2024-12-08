export default async (command, message, args) => {
  if (command.permissions) {
    for (const permission of command.permissions) {
      if (!message.member.permissions.has(permission)) {
        return sendError(message, {
          title: "Missing required permission",
          description: `You require the \`${permission}\` permission to run that command`
        })
      }
    }
  }
  if (command.arguments) {
    for (const [i, argument] of command.arguments.entries()) {
      if (!args[i]) {
        if (argument.required) {
          return sendError(message, {
            title: "Missing required argument",
            description: `Please enter: ${argument.name.quote()}`
          })
        }
        if (argument.default) {
          args[i] = argument.default
        } else {
          continue
        }
      }
      if (i === command.arguments.length - 1) {
        args[i] = args.slice(i).join(" ")
      }
      const result = await argTypes[argument.type](args[i], message, argument)
      if (result instanceof Discord.Message) {
        return
      }
      if (result === undefined) {
        return sendError(message, {
          title: `Invalid argument type for ${argument.name.quote()}`,
          description: `${args[i].limit().quote()} is not a valid ${argument.type.quote()}`
        })
      }
      args[i] = result
    }
  }
  try {
    await command.execute(message, ...args)
  } catch (err) {
    console.log(`Error while processing command "${command.name}":`, err)
  }
}