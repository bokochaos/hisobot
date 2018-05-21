/*
 * Created:				  02 Jan 2018
 * Last updated:		20 May 2018
 * Developer(s):		CodedLotus, Paddington, Axiom
 * Description:			Metal Zone data command
 * Version #:			  1.1.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Recreated the original MZ command (with minor modern tweaks) using RichEmbeds over text/paragraphs
    1.0.1: Added an additional RichEmbed field to the "MZ All" command: Open Now
    1.1.0: Added "Open Now" to all results.
            Shifted from "One Zone or All Zones" to a "Pick Your Zones" system.
            Shifted from "int" zone to "string" zones, using regex validation and "in-depth" parsing.
              Thanks Axi and Padd for contributing 99% of the regex design! This update is for you both!
            Subsequently rewrote large portions of MZ output to accomodate for:
              parsing through troll input (w/ lazy personality-feigning response output)
              empty string -> full schedule output (business as usual)
              single number processing (more business as usual)
              collections of numbers where zones might be "missing" (because some days you don't want to play MZ2 or 3)
            Switched text output from ""+"" to template literals
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

/* Metal Zone Tracker */
//const MZSchedule = require("./../../constants/MZTable");

/*,
  validate: zone => {
    if (zone == '' || (zone > 0 && zone < 8) ) return true;
    return "That doesn't seem like a valid zone to me";
  }*/

module.exports = class MetalAlertCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'metal',
      aliases: ['mz'],
      group: 'tb1',
      memberName: 'metal',
      description: 'Replies with the current MZ schedule.',
      examples: ['metal', 'mz', 'mz 7', 'metal 1-3, 6, 7'],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'zones',
          prompt: `Which zone(s) do you want to know about?
\`\`\`Our new string format works like this:
7: Zone 7 only
1, 3-5, 7: Zones 1, 3, 4, 5, and 7
2-6: Zones 2, 3, 4, 5, and 6
1, 4, 7: Zones 1, 4, and 7\`\`\``,
          type: 'string',
          default: "",
          validate: zones => {
            if(!/^(\d[-\d]?[,\s?\d(-\d)]*)?$/g.test(zones)){return "Can we try that again?\n";}
            return true;
          },
          parse: zones => {
            if(zones.length == 0){ return zones; } //default case -> get all zones
            //Get the MZSchedule object for reference, and splice string
            const MZSchedule = this.client.MZSchedule;
            var segments = zones.split(/\s*,\s*/g);
            segments.forEach(function(element, index, array){array[index] = element.trim();});
            //Manage max > MAX and min < MIN troll answers, among other things
            segments = segments.filter(word => word.length > 0
              && !(word.length == 1 && (parseInt(word) < MZSchedule._MIN_ZONE || parseInt(word) > MZSchedule._MAX_ZONE))
              && !(word.length > 1 && !word.includes("-")) );
            
            //Create set and populate from string splices
            var outZones = new Set();
            for(let seg of segments){
              /* Cases to watch for and how to respond:
               * 1. 1 digit && (min > MIN_VALUE || max < MAX_VALUE) -> add to final set (not troll value)
               * 2. length > 1 && includes("-") -> check min&max -> determine troll values ->  continue/add to final set
               */
              if(seg.length == 1) {outZones.add(parseInt(seg));}
              /*else if(seg.length > 1 && !seg.includes("-")){
                //Most cases currently we ignore this. Future-proofing; I can manage this later.
                continue;
              }*/
              else{
                var zoneSegs = seg.split(/\s*-\s*/g).filter(word => word.length > 0);
                var zoneMax = Math.max(...zoneSegs),
                    zoneMin = Math.min(...zoneSegs);
                
                //Isolate the fast-parser troll cases -> ignore -> "continue;"
                if(zoneMax < MZSchedule._MIN_ZONE && zoneMin < MZSchedule._MIN_ZONE ) {continue;}
                else if (zoneMax > MZSchedule._MAX_ZONE && zoneMin > MZSchedule._MAX_ZONE ) {continue;}
                
                //Isolate the half-troll cases and correct -> "min/max = MZS._MIN/_MAX;"
                if(zoneMax > MZSchedule._MAX_ZONE){zoneMax = MZSchedule._MAX_ZONE;}
                if(zoneMin < MZSchedule._MIN_ZONE){zoneMin = MZSchedule._MIN_ZONE;}
                for(var zoneN = zoneMin; zoneN <= zoneMax; ++zoneN){ outZones.add(zoneN); }
                //console.log(outZones);
              }
            }
            return outZones;
          }
        }
      ]
    });
  }

  run(msg, args) {
    //return msg.embed(args.zones);
    //return msg.say(this._advancedParse(msg, args.zones).size);
    //msg.say(args.zones.entries());
    //return msg.say(typeof args.zones === "object" ? (args.zones.size ? args.zones.size : "Hah, no") : typeof args.zones );
    //return msg.say((args.zones.size ? args.zones.size : "Hah, no"));
    var MZ_EMBED = this._metalZone(args.zones);
    if(typeof MZ_EMBED === "string"){
      return msg.say(MZ_EMBED);
    }
    return msg.embed(MZ_EMBED);
  }
  
  //reduce content somehow
  _metalZone(zones){
    //DO NOT EVER MOVE THIS CONST DECLARATION DOWN!!!
    const MZSchedule = this.client.MZSchedule;
        
    //Check zones isn't a failed/troll MZ command via typeof, and get all results.
    if (typeof zones === "string" && !zones){ //!mz base call formatting
      zones = new Set();
      for(var i = MZSchedule._MIN_ZONE; i <= MZSchedule._MAX_ZONE; ++i){zones.add(i);}
    }
    zones = Array.from(zones); zones.sort(function(a,b){return a-b;}); //Array conversion complete
    //If user trolls with bad numbers, troll back.
    if(zones.length == 0){return "Hah, nope";}
    
    var MZ_EMBED = new RichEmbed()
          .setTitle("Metal Zone Schedule")
          .setDescription("Times are in D:HH:MM (Stamina recovery) format")
          .setURL("http://crape.org/tools/terra-battle/mz.html")
          .setColor([0, 0, 255])
          .setFooter("FYI: Non-AHTK open every 6-7 hours.", "https://cdn.discordapp.com/attachments/360906433438547978/399164651264409602/Terra_Battle_FFVIII.jpg")
          .setThumbnail("https://vignette.wikia.nocookie.net/terrabattle/images/1/16/Golden_Runner.png/revision/latest?cb=20150701095945")
          .setTimestamp();
    
    //Start of "Open Now" embed segment
    const currentMZSchedule = MZSchedule.getOpenZones(new Date()); var openNow = "";
    for (var zoneNum = 0; zoneNum < MZSchedule._MAX_ZONE; ++zoneNum){
      if(currentMZSchedule[zoneNum] > 0){
        openNow += `${openNow.length ? ', ' : ""}${zoneNum+1}${currentMZSchedule[zoneNum]==MZSchedule._STAT_KING ? "K" : ""}`;
      }
    } if(openNow.length){ MZ_EMBED = MZ_EMBED.addField("Open Now!", openNow); } //End of "Open Now" embed segment
    
    //Start of specific zone checks (1-2 zones requested)
    if(zones.length < 3){
      for(zoneNum of zones){
        const futureMZSchedule = MZSchedule.getSpecificZoneSchedule(zoneNum);
        //Normal
        MZ_EMBED = MZ_EMBED.addField(`Metal Zone ${zoneNum}`,
        `${futureMZSchedule.openZoneSchedule.MZString} (${futureMZSchedule.openZoneSchedule.stamina})`,
        true);
        //AHTK
        MZ_EMBED = MZ_EMBED.addField(`Metal Zone ${zoneNum} AHTK`,
        `${futureMZSchedule.openAHTKSchedule.MZString} (${futureMZSchedule.openAHTKSchedule.stamina})`,
        true);
      }
    }//End of specific zone checks
    
    //Start of larger scale zone checks (3+ zones requested)
    else {
      const futureMZSchedule = MZSchedule.getNextZoneSchedule();
      //console.log(futureMZSchedule);
      for(zoneNum of zones){
        //console.log(`${zoneNum} ${futureMZSchedule.openZoneSchedule[zoneNum-1].MZString} ${futureMZSchedule.openAHTKZoneSchedule[zoneNum-1].MZString}`);
        //for (var zoneNum = 0; zoneNum < MZSchedule._MAX_ZONE; ++zoneNum){
        //Normal
        MZ_EMBED = MZ_EMBED.addField(`Metal Zone ${zoneNum}`,
        `${futureMZSchedule.openZoneSchedule[zoneNum-1].MZString} (${futureMZSchedule.openZoneSchedule[zoneNum-1].stamina})`,
        true);
        //AHTK
        MZ_EMBED = MZ_EMBED.addField(`Metal Zone ${zoneNum} AHTK`,
        `${futureMZSchedule.openAHTKSchedule[zoneNum-1].MZString} (${futureMZSchedule.openAHTKSchedule[zoneNum-1].stamina})`,
        true);
      }
    }//End of larger scale zone checks
    
    return MZ_EMBED;
  }
};