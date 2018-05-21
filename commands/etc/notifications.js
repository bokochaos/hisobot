/*
 * Created:				  27 Apr 2018
 * Last updated:		20 May 2018
 * Developer(s):		CodedLotus
 * Description:			Restart Hisobot alerts
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: First attempt at a command-based notification reloader
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const Discord = require('discord.js');

const IntervalAlerts = require("./../../constants/interval.js");

module.exports = class ShutdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'notifications',
            aliases: ['notify', 'alerts'],
            group: 'etc',
            memberName: 'notifications',
            description: 'Mods only: Restarts Hisobot alerts.',
            userPermissions: ['BAN_MEMBERS'],
            examples: ['notifications', 'notify', 'alerts']
        });
    }

    run(msg) {
      //console.log("Kweh! (chocobot out!)");
	    //msg.message.channel.send("Hisobot out!");
	    
      console.log(`Invoking Command-based reload
Time is: ${new Date()}
Clearing out timeouts and intervals`);
      for (const t of this.client._timeouts) clearTimeout(t);
      for (const i of this.client._intervals) clearInterval(i);
      this.client._timeouts.clear();
      this.client._intervals.clear();
      //alert that the bot is online
      
      let now = new Date(), nextMinute = new Date();
      nextMinute.setMilliseconds(0); nextMinute.setSeconds(0); nextMinute.setMinutes(nextMinute.getMinutes() +1);
      this.client.setTimeout(this.alertSetup, nextMinute-now, this.client);
      return msg.say("Hisobot refresh complete!");
    }
    
    alertSetup(client){
      IntervalAlerts(client, client.MZSchedule, client.DQSchedule); //call at the start of the first minute
      try {
        client.setInterval(IntervalAlerts, 1000*60, client, client.MZSchedule, client.DQSchedule);
      } catch (err){
        console.log(client);
      }
    }
};