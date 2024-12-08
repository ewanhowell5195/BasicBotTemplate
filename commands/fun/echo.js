export default {
  description: "Echo a message",
  arguments: [{
    name: "message",
    maxLength: 128,
    default: "You forgot the message"
  }],
  execute: (message, content) => sendMessage(message, { content })
}