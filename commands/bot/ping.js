export default {
  description: "Check the bots ping",
  aliases: ["pong"],
  async execute(message) {
    const before = Date.now()
    const ping =await sendMessage(message, {
      author: {
        name: "Pinging..."
      },
      fields: [{
        name: "API latency",
        value: client.ws.ping === -1 ? "Not calculated yet" : `${Math.round(client.ws.ping)} ms`
      }]
    })
    editMessage(ping, {
      author: {
        name: "Pong"
      },
      fields: [
        {
          name: "API latency",
          value: client.ws.ping === -1 ? "Not calculated yet" : `${Math.round(client.ws.ping)} ms`
        },
        {
          name: "Bot latency",
          value: `${Date.now() - before} ms`
        }
      ]
    })
  }
}