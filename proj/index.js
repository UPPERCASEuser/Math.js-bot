const Eris = require("eris");
const math = require('mathjs');
const fs = require("fs");
var BS= require("botlist.space");
const DBL = require("dblapi.js");

//website
const express = require('express');
const keepalive = require('express-glitch-keepalive');

const app = express();

app.use(keepalive);

app.use(express.static('public'));

app.get('/', (req, res) => {
 res.sendFile(__dirname + '/views/appindex.html');
});
app.get("/", (request, response) => {
 response.sendStatus(200);
});
app.listen(process.env.PORT);


//code
var prefixes = ["mjs!", "!mjs", "Mjs!", "! Mjs", "!Mjs", "! mjs", "! Mjs", "MJS!", "!MJS", "mjs1", "1mjs", "Mjs1", "1 Mjs", "1Mjs", "1 mjs", "1 Mjs", "MJS1", "1MJS", "@mention ", "@mention"];
//args.trim().slice(1);

var bot = new Eris.CommandClient(process.env.BOT_TOKEN, {}, {
    description: "An bot with the engine of math.js",
    owner: "A user",
    prefix: prefixes,
	defaultHelpCommand: false
});

const bsClient = new BS({ botToken: process.env.BS_TOKEN, id: '538357066805411841' })
const dbl = new DBL(process.env.DBL_TOKEN, bot);

bot.on("ready", () => { // When the bot is ready
    console.log("Servers: " + bot.guilds.size + "." + " Logged in: " + bot.user.id);
    bot.editStatus("online", { name: "mjs!help | " + bot.guilds.size +  " servers", type: 3});
  bsClient.postServerCount(bot.guilds.size);
  dbl.postStats(bot.guilds.size);
});

bot.on("guildCreate", (guild) => {
	console.log("Server joined! Server counter: " + bot.guilds.size);
	bot.editStatus("online", { name: "mjs!help | " + bot.guilds.size +  " servers", type: 3});
  bsClient.postServerCount(bot.guilds.size);
  dbl.postStats(bot.guilds.size);
});

bot.on("guildDelete", (guild) => {
	console.log("Server Removed ;-;. Server counter: " + bot.guilds.size);
	bot.editStatus("online", { name: "mjs!help | " + bot.guilds.size +  " servers", type: 3});
  bsClient.postServerCount(bot.guilds.size);
  dbl.postStats(bot.guilds.size);
});

bot.registerCommand("help", (msg, args) => {
  function sendHelp(id){
  	bot.createMessage(id, {
		  embed: {
			  color: 0xde3812, // Color, either in hex (show), or a base-10 integer
			  author: { // Author property
				  name: "Commands",
				  icon_url: bot.user.avatarURL
			  },
			  fields: [ // Array of field objects
				  {
					  name: "help", // Field title
					  value: "This command", // Field
					  inline: false // Whether you want multiple fields in same line
				  },
          {
            name: "info", // Field title
            value: "An information of this bot", // Field
            inline: false // Whether you want multiple fields in same line
          },
				  {
					  name: "ping", // Field title
					  value: "Pong!", // Field
					  inline: false // Whether you want multiple fields in same line
				  },
				  {
					  name: "invite",
					  value: "Invite me!",
					  inline: false
				  },
				  {
					  name: "calc <calc>", // Field title
					  value: "The best command of the bot\n-- calc roll <num>: Roll a number\n-- calc flip: Flip a coin\n-- calc roman: Convert an number to roman\n-- calc dec: Convert an roman number to decimal", // Field
					  inline: false // Whether you want multiple fields in same line
				  }
			  ],
        footer: { // Footer text
          text: "Don't include <> on commands",
				  icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
        }
		  }
	  });
  };
  if(args.join(" ") == "here"){ sendHelp(msg.channel.id); } else {bot.getDMChannel(msg.author.id).then(Privado => { sendHelp(Privado.id); if (msg.channel.guild) {bot.createMessage(msg.channel.id, "Check your DMs!");} })};
}, {
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
bot.registerCommandAlias("commands", "help");
bot.registerCommandAlias("command", "help");
bot.registerCommandAlias("bothelp", "help");
bot.registerCommandAlias("HELP", "help");
bot.registerCommandAlias("Help", "help");
bot.registerCommandAlias("h", "help");
bot.registerCommandAlias("H", "help");
bot.registerCommandAlias("", "help"); //yep this   w e i r e d   alias work

bot.registerCommand("ping", (msg) => {
	async function ping() {
		const m = await bot.createMessage(msg.channel.id, ":arrows_counterclockwise:");
		m.edit(":ping_pong: Pong! " + (m.timestamp - msg.timestamp) + "ms");
	}
	ping();
}, {
    description: "Pong!",
    fullDescription: "This command could be used to check if the bot is up. Or entertainment when you're bored.",
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
bot.registerCommandAlias("PING", "ping");
bot.registerCommandAlias("Ping", "ping");

var calcCommand = bot.registerCommand("calc", (msg, args) => { // Make an echo command
    if(args.length === 0) { // If the user just typed "!echo", say "Invalid input"
        return "Insert an text";
    }
    var text = args.join(" ").replace("`", "");
    text = text.replace("`", "");
    text = text.replace("²", "^2");
    text = text.replace("π", "pi"); // Make a string of the text after the command label
	  try {
		  if (isNaN(text) || !isFinite(text)) {
			  try {
				  var result = math.eval(text);
				  bot.createMessage(msg.channel.id, {
				  	embed: {
					  	color: 0xde3812, // Color, either in hex (show), or a base-10 integer
						  author: { // Author property
							  name: "Result",
							  icon_url: bot.user.avatarURL
						  },
						  fields: [ // Array of field objects
							  {
								  name: "Mathematical account", // Field title
								  value: "```" + text + "```", // Field
								  inline: true // Whether you want multiple fields in same line
						  	},
							  {
								  name: "Result", // Field title
								  value: "```js\n" + result + "```", // Field
								  inline: true // Whether you want multiple fields in same line
						  	}
						  ],
						  footer: { // Footer text
							  text: "Try to use the aliases of this command!",
							  icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256",
						  }
					  }
				  });
			  } catch (e) {
				  bot.createMessage(msg.channel.id, {
					  embed: {
						  color: 0xff0000, // Color, either in hex (show), or a base-10 integer
						  author: { // Author property
							  name: "Error",
							  icon_url: "https://cdn.discordapp.com/attachments/507651369147170842/551108357134483482/error.png"
						  },
						  description: "```" + e.toString() + "```",
						  footer: { // Footer text
							  text: "Verify your math operation. Remenber: try to use the dot, not the comma",
							  icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
						  }
					  }
				  });
			  }
      } else {
			  bot.createMessage(msg.channel.id, {
				  embed: {
					  color: 0xff0000, // Color, either in hex (show), or a base-10 integer
					  author: { // Author property
						  name: "Error",
						  icon_url: "https://cdn.discordapp.com/attachments/507651369147170842/551108357134483482/error.png"
					  },
					  description: "A text or bug has been detected, try to use math accounts",
					  footer: { // Footer text
						  text: "Verify your math operation. Remenber: try to use the dot, not the comma",
						  icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
					  }
				  }
			  });
		  }
	  } catch (e) {
		  bot.createMessage(msg.channel.id, {
			  embed: {
				  color: 0xff0000, // Color, either in hex (show), or a base-10 integer
				  author: { // Author property
					  name: "Error",
					  icon_url: "https://cdn.discordapp.com/attachments/507651369147170842/551108357134483482/error.png"
				  },
				  description: "```" + e.toString() + "```",
				  footer: { // Footer text
					  text: "Verify your math operation. Remenber: try to use the dot, not the comma",
					  icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
				  }
			  }
		  });
	  }
}, {
    description: "Calculate",
    fullDescription: "Calculate anything using the math.js engine",
    usage: "<text>",
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
bot.registerCommandAlias("calculate", "calc");
bot.registerCommandAlias("math", "calc");
bot.registerCommandAlias("maths", "calc");
bot.registerCommandAlias("Calc", "calc");
bot.registerCommandAlias("CALC", "calc");
bot.registerCommandAlias("c", "calc");
bot.registerCommandAlias("C", "calc");

calcCommand.registerSubcommand("roll", (msg, args) => { // Make a reverse subcommand under echo
	if(args.length === 0 || isNaN(args[0])) { // If the user just typed "!echo reverse", say "Invalid input"
        var number = (Math.floor(Math.random() * 5) + 1);
    }else{
		var number = Math.floor(Math.random() * args[0]);
	}
				bot.createMessage(msg.channel.id, {
					embed: {
						color: 0xde3812, // Color, either in hex (show), or a base-10 integer
						author: { // Author property
							name: "🎲 You rolled",
						},
						description: "```" + number + "```",
						footer: { // Footer text
							text: "I like dices!",
							icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
						}
					}
				});
}, {
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});

calcCommand.registerSubcommandAlias("dice", "roll"); // Alias "!echo backwards" to "!echo reverse"
calcCommand.registerSubcommandAlias("Roll", "roll"); // Alias "!echo backwards" to "!echo reverse"
calcCommand.registerSubcommandAlias("ROLL", "roll"); // Alias "!echo backwards" to "!echo reverse"

bot.registerCommand("invite", (msg) => {
	bot.createMessage(msg.channel.id, {
		embed: {
		description: "**[Invite](https://discordapp.com/oauth2/authorize?client_id=538357066805411841&permissions=391232&redirect_uri=http%3A%2F%2Fmathjs.org%2Findex.html&scope=bot)**\n\n[Official server](https://discord.gg/67NkaBY)\n[Github](https://github.com/UPPERCASEuser/Math.js-bot)\n[List to-do](https://trello.com/invite/b/ZndibEkk/e0cfe1d171c054a98f5a609e505833b4/mathjs-bot)\n[Upvote it!](https://discordbots.org/bot/538357066805411841/vote)",
			author: { // Author property
				name: "Invite",
				icon_url: bot.user.avatarURL
			},
			color: 0xde3812, // Color, either in hex (show), or a base-10 integer
		}
	});
}, {
    description: "Invite me!",
    fullDescription: "Invite me to your server",
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
bot.registerCommandAlias("INVITE", "invite");
bot.registerCommandAlias("Invite", "invite");

calcCommand.registerSubcommand("flip", (msg) => {
	var number = Math.floor(Math.random() * 11);
	if(number < 6) var message = "<:heads:544193801129033748> Heads"
	else var message = "<:tails:544193651077546034> Tails"
	bot.createMessage(msg.channel.id, {
		embed: {
			color: 0xde3812, // Color, either in hex (show), or a base-10 integer
			description: message
		}
	});
}, {
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
calcCommand.registerSubcommandAlias("Flip", "flip"); // Alias "!echo backwards" to "!echo reverse"
calcCommand.registerSubcommandAlias("FLIP", "flip"); // Alias "!echo backwards" to "!echo reverse"

calcCommand.registerSubcommand("roman", (msg, args) => {
  var num = args.join(" ");
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    var output = Array(+digits.join("") + 1).join("M") + roman;
  				bot.createMessage(msg.channel.id, {
					embed: {
						color: 0xde3812, // Color, either in hex (show), or a base-10 integer
						author: { // Author property
							name: "Output",
						},
						description: "```" + output + "```",
						footer: { // Footer text
							text: "Use mjs!calc dec",
							icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
						}
					}
				});
}, {
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
calcCommand.registerSubcommandAlias("Roman", "roman"); // Alias "!echo backwards" to "!echo reverse"
calcCommand.registerSubcommandAlias("ROMAN", "roman"); // Alias "!echo backwards" to "!echo reverse"

calcCommand.registerSubcommand("decimal", (msg, args) => {
  function roman_to_Int(str1) {
 if(str1 == null) return -1;
 var num = char_to_int(str1.charAt(0));
 var pre, curr;

 for(var i = 1; i < str1.length; i++){
  curr = char_to_int(str1.charAt(i));
  pre = char_to_int(str1.charAt(i-1));
  if(curr <= pre){
   num += curr;
  } else {
   num = num - pre*2 + curr;
  }
 }

 return num;
}

function char_to_int(c){
 switch (c){
  case 'I': return 1;
  case 'V': return 5;
  case 'X': return 10;
  case 'L': return 50;
  case 'C': return 100;
  case 'D': return 500;
  case 'M': return 1000;
  default: return -1;
 }
}
  			bot.createMessage(msg.channel.id, {
					embed: {
						color: 0xde3812, // Color, either in hex (show), or a base-10 integer
						author: { // Author property
							name: "Output",
						},
						description: "```" + roman_to_Int(args.join("")) + "```",
						footer: { // Footer text
							text: "Use mjs!calc roman",
							icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
						}
					}
				});
}, {
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
calcCommand.registerSubcommandAlias("Decimal", "decimal"); // Alias "!echo backwards" to "!echo reverse"
calcCommand.registerSubcommandAlias("DECIMAL", "decimal"); // Alias "!echo backwards" to "!echo reverse"
calcCommand.registerSubcommandAlias("dec", "decimal"); // Alias "!echo backwards" to "!echo reverse"

bot.registerCommand("info", (msg, args) => {
	bot.createMessage(msg.channel.id, {
		embed: {
			description: "Hello, this bot calculates math expressions using `mjs!calc`.\nSee the list of commands using `mjs!help`",
			author: { // Author property
				name: "Info",
				icon_url: bot.user.avatarURL
			},
			color: 0xde3812, // Color, either in hex (show), or a base-10 integer
		}
	});
}, {
    description: "Invite me!",
    fullDescription: "Invite me to your server",
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
bot.registerCommandAlias("Info", "info");
bot.registerCommandAlias("INFO", "info");
bot.registerCommandAlias("information", "info");

bot.connect();
