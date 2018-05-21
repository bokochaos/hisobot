/*
 * Created:				  20 May 2018
 * Last updated:		20 May 2018
 * Developer(s):		CodedLotus
 * Description:			"Coop With Me" embed-sending command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Have a fully functional version prepared for use
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class CoopCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coop',
            aliases: ['coopwithme'],
            group: 'general',
            memberName: 'coop',
            description: 'CO-OP WITH ME',
            examples: ['coop', 'coopwithme'],
            throttling: {
              usages: 2,
              duration: 30
            },
        });
    }

    run(msg) {
      
      const CoopEmbed = new RichEmbed()
        .setTitle("CO-OP WITH ME")
        .setDescription("Author: __Rexlent__")
        .setURL("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=48318006")
        .setColor([250, 217, 90])
        .setImage("https://cdn.discordapp.com/attachments/301409865174220812/431939837189423107/Co-op_with_me.jpg")
        .setFooter("CO-OP WITH ME!")
        .setTimestamp();

      /*{ 
        "embed": {
          "title": "SamaNtha?",
          "description": "Author: __Rexlent__",
          "url": "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=48388120",
          "color": 16439642,
          "footer": {
            "text": "You know. ( ͡° ͜ʖ ͡°)"
          },
          "image": {
            "url": "https://cdn.discordapp.com/attachments/360906433438547978/399155381298790411/samatha.png"
          }
        }
      };*/
      
      /*
      sendMessage(command, "Uploaded by Alpha12 of the Terra Battle Wiki");
      sendMessage(command, new Discord.Attachment("./assets/vengeful_heart.png"));
      */
      return msg.embed(CoopEmbed);
    }
};