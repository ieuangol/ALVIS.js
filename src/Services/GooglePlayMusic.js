const Discord = require('discord.js');
const PlayMusic = require('playmusic');
const fs = require('fs');
const http = require('http');
const request = require('request');
const m3u8stream = require('m3u8stream');


class GooglePlayMusic {
  constructor(bot) {
    this.bot = bot;
    this.pm = new PlayMusic();
    var config = this.bot.config;
    this.pm.init({androidId: config.google_credentials.androidId, masterToken: config.google_credentials.masterToken}, function(err){
      if (err) console.log(err);
    });
  }

  startStreamFromSearch(message, search_string, stream_options) {
    var gpm_logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Play_music_triangle.svg/1200px-Play_music_triangle.svg.png";
    var discord_bot = this.bot;
    var play_music = this.pm;
    var found_track = false;
    play_music.search(search_string, 100, function(err, data) {
      for (var i in data.entries){
        if (data.entries[i].type == 1){
          var song = data.entries[i];
          found_track = true;
          break;
        }
      }
      if (found_track){
        play_music.getStreamUrl(song.track.storeId, function(err, streamUrl) {
          if (err) console.log(err);
          var voiceChannel = message.member.voiceChannel;
          streamUrl = streamUrl.replace("https", "http");
          var file = fs.createWriteStream("./assets/temp/" + message.guild.id + ".mp3");
          var request = http.get(streamUrl, function(response) {
            response.pipe(file);
            var duration = song.track.durationMillis/60000;
            var duration_minutes = Math.floor(duration);
            var duration_seconds = ("0" + Math.floor((duration - duration_minutes) * 60)).slice(-2);
            var embed = new Discord.RichEmbed()
            .setAuthor("Now playing in #" + message.member.voiceChannel.name + ":")
            .setTitle(song.track.title)
            .setDescription(song.track.artist + " **-** *" + song.track.album + "*\n`" + duration_minutes + ":" + duration_seconds + "`")
            .setThumbnail(song.track.albumArtRef[0].url)
            .setColor(parseInt(discord_bot.colours.google_play_music_embed_colour))
            .setFooter("Playing from Google Play Music | ©2018 Google", gpm_logo);
            embed.duration = duration;
            discord_bot.util.setLastSongEmbed(message.guild.id, embed);
            message.channel.send("", {"embed": embed}).then((msg) => {
              if (msg.channel instanceof Discord.TextChannel) discord_bot.messageCleanupQueue.add(msg, duration, true, ["currentlyplaying" + msg.guild.id]);
              discord_bot.util.attachMediaControlReactions(msg);
            });
            discord_bot.util.playSound(message.member.voiceChannel, "./assets/temp/" + message.guild.id + ".mp3", stream_options);
          });
        });
      }else{
        message.reply("I could not find any songs matching your request on Google Play Music.")
        .then((msg) => {if (msg.channel instanceof Discord.TextChannel) discord_bot.messageCleanupQueue.add(msg, 1, true)});
      }
    }, function(msg, body, err, httpResponse) {
        console.log(msg);
    });
  }

  startCurrentlyCachedSong(message, response, stream_options) {
    var discord_bot = this.bot;
    if (fs.existsSync("./assets/temp/" + message.guild.id + ".mp3")) {
      message.reply(response.result.fulfillment.speech)
      .then((msg) => {if (msg.channel instanceof Discord.TextChannel) discord_bot.messageCleanupQueue.add(msg, 1, true)});
      var embed = discord_bot.util.getLastSongEmbed(message.guild.id);
      if (embed){
        embed.setDescription("Now playing in " + message.member.voiceChannel + ":");
        var duration = embed.duration;
        message.channel.send("", {"embed": embed})
        .then((msg) => {
          if (msg.channel instanceof Discord.TextChannel) discord_bot.messageCleanupQueue.add(msg, duration, true, ["currentlyplaying" + msg.guild.id]);
          discord_bot.util.attachMediaControlReactions(msg);
        });
      }
      discord_bot.util.playSound(message.member.voiceChannel, "./assets/temp/" + message.guild.id + ".mp3", stream_options);
    }else{
      message.reply("There is currently no song to replay.")
      .then((msg) => {if (msg.channel instanceof Discord.TextChannel) discord_bot.messageCleanupQueue.add(msg, 1, true)});
    }
  }
}

module.exports = GooglePlayMusic;
