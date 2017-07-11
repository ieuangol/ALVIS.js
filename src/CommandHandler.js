const Discord = require('discord.js');
const CommandExecuter = require('./CommandExecuter.js');
const fs = require('fs');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandExecuter = new CommandExecuter(this.bot);
  }

  handle(message) {
    if (!message.content.startsWith(this.bot.basic.command_prefix)){
      return;
    }
    const splitmessage = message.content.split(" ");
    const command_prefix = this.bot.basic.command_prefix;
  	const command = splitmessage[0].slice(command_prefix.length).toLowerCase();;
    const body = message.content.substring(message.content.indexOf(" ") + 1);
  	const arg1 = splitmessage[1];
  	const arg2 = splitmessage[2];
  	const arg3 = splitmessage[3];

    if (command === "addallmusic"){
      this.commandExecuter.addallmusicCommand(message);
    }else if (command === "addallsounds"){
      this.commandExecuter.addallsoundsCommand(message);
    }else if (command === "addsong"){
      this.commandExecuter.addsongCommand(message, arg1);
    }else if (command === "addsound"){
      this.commandExecuter.addsoundCommand(message, arg1);
    }else if (command === "about"){
      this.commandExecuter.aboutCommand(message);
    }else if (command === "flip"){
      this.commandExecuter.flipCommand(message);
    }else if (command === "help"){
      this.commandExecuter.helpCommand(message);
    }else if (command === "playmusic"){
      this.commandExecuter.playmusicCommand(message, arg1, arg2, body);
    }else if (command === "playsound"){
      this.commandExecuter.playsoundCommand(message, arg1, arg2, body);
    }else if (command === "playstream"){
      this.commandExecuter.playstreamCommand(message, arg1);
    }else if (command === "purgemusic"){
      this.commandExecuter.purgemusicCommand(message, arg1);
    }else if (command === "purgesounds"){
      this.commandExecuter.purgesoundsCommand(message, arg1);
    }else if (command === "removesong"){
      this.commandExecuter.removesongCommand(message, arg1);
    }else if (command === "removesound"){
      this.commandExecuter.removesoundCommand(message, arg1);
    }else if (command === "r6stats"){
      this.commandExecuter.r6statsCommand(message, arg1, arg2);
    }else if (command === "roll"){
      this.commandExecuter.rollCommand(message, arg1);
    }else if (command === "say"){
      this.commandExecuter.sayCommand(message);
    }else if (command === "setusersound"){
      this.commandExecuter.setusersoundCommand(message, arg1, arg2);
    }else if (command === "showusersounds"){
      this.commandExecuter.showusersoundsCommand(message);
    }else if (command === "songinfo"){
      this.commandExecuter.songinfoCommand(message, arg1);
    }else if (command === "soundinfo"){
      this.commandExecuter.soundinfoCommand(message, arg1);
    }else if (command === "stop"){
      this.commandExecuter.stopCommand(message);
    }else{
      message.author.send("Sorry. I do not recognize that command. Use **" + command_prefix + "help** for a list of commands.");
      this.bot.util.cleanupMessage(message);
    }
  }
}

module.exports = CommandHandler;
