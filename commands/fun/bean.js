export default {
  description: "Bean a member",
  permissions: ["BanMembers"],
  arguments: [{
    type: "member",
    required: true,
    self: false
  }],
  execute: (message, member) => sendMessage(message, {
    title: "Beaned",
    description: `${member} was beaned by ${message.author}`
  })
}