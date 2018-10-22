/*
 * Created:				  01 Aug 2017
 * Last updated:		21 Oct 2018
 * Developer(s):		CodedLotus
 * Description:			Return a Discord.JS Collection object with pairs for names
 * Version #:			1.1.2
 * Version Details:
		1.0.0: "Constant" list of names used until live database is built
		1.0.1: TBF role added as assignable
    1.1.0: Added voidRoleStrings as a central management for voided roles. Turned the export into a JSO for Hisobot management.
    1.1.1: Added TB1 Coop role to new role adds, added other roles to unassignables
    1.1.2: Removed TB2 roles (RIP TB2), TB1 Co-op (5.5.x removes TB1 co-op functionality)
		
 */

//const Collection = require('../discord.js/util/Collection');

/**
 *  A collection of role names and their alternate names that pertain to roles within the /r/TerraBattle subreddit
 * @type {Collection<string,string>}
 */
var roleNames = new Map();
const roleStrings = ["Terra Battle", "Terra Battle 2", "Terra Wars", "Veteran", "TBF", "TB2 Co-op", "TB Co-op"];

roleNames.set("terra battle", roleStrings[0]);
roleNames.set("terra battle 1", roleStrings[0]);
roleNames.set("tb", roleStrings[0]);
roleNames.set("tb1", roleStrings[0]);

/*roleNames.set("terra battle 2", roleStrings[1]);
roleNames.set("terra battle2", roleStrings[1]);
roleNames.set("tb2", roleStrings[1]);*/

roleNames.set("terra wars", roleStrings[2]);
roleNames.set("tw", roleStrings[2]);

/*roleNames.set("veteran", roleStrings[3]);
roleNames.set("vet", roleStrings[3]);*/

roleNames.set("tbf", roleStrings[4]);
roleNames.set("forum", roleStrings[4]);

/*roleNames.set("tb2 coop", roleStrings[5]);
roleNames.set("coop2", roleStrings[5]);
roleNames.set("tb2 co-op", roleStrings[5]);*/

/*roleNames.set("tb coop", roleStrings[6]);
roleNames.set("tb1 co-op", roleStrings[6]);
roleNames.set("coop1", roleStrings[6]);*/




const voidRoleStrings = ["administrator", "moderator", "companion", "pvp", "content", "wiki", "metal", "bot", "dyno", "endgame", "mist", "data", "content" ];


module.exports = {openRoles: roleNames, voidRoles: voidRoleStrings };

