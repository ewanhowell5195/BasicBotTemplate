export default (item, message, args) => {
  if (args.lowerCase) item = item.toLowerCase()
  if (args.options) {
    const lower = item.toLowerCase()
    const option = args.options.find(e => e.toLowerCase() === lower)
    if (!option) {
      return sendError(message, {
        title: `Invalid option for ${args.name.quote()}`,
        description: `${item.limit.quote()} is not a valid option for ${args.name.quote()}`,
        fields: [["Available Options", `\`${options.join("`, `")}\``]]
      })
    }
    item = option
  }
  if (args.minLength && item.length < args.minLength) {
    return sendError(message, {
      title: `${args.name.quote()} too short`,
      description: `${item.limit().quote()} is too short. The minimum length is ${args.minLength.quote()} characters`
    })
  }
  if (args.maxLength && item.length > args.maxLength) {
    return sendError(message, {
      title: `${args.name.quote()} too long`,
      description: `${item.limit().quote()} is too long. The maximum length is ${args.maxLength.quote()} characters`
    })
  }
  return item.trim()
}