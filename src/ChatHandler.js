const Discord = require('discord.js');

class ChatHandler {
  constructor(bot) {
    this.bot = bot;
  }

  handle(message) {
    if (message.content.startsWith(this.bot.basic.command_prefix)){
      return;
    }
    if (message.isMentioned(this.bot.basic.user_id)){
      this.bot.util.queryBotResponse(message);
      return;
    }
    const rawcontent = message.content.toLowerCase();
    var username = this.bot.basic.username;
    if (rawcontent.includes(username.toLowerCase()) && !rawcontent.includes("\\" + username.toLowerCase()) && this.bot.config.assistOnNameOverheard){
      var response = this.bot.responses.overheardNameResponse;
      message.reply(response)
      .then((msg) => {this.bot.messageCleanupQueue.add(msg, 0.5, true)});
      this.bot.util.logger("Responded to name mention from " + message.author.username + " on " + message.guild.name + ":" + message.channel.name);
      return;
    }
  }
}

module.exports = ChatHandler;
