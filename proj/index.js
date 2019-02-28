const Eris = require("eris");
const math = require('mathjs');
const fs = require("fs");

var bot = new Eris.CommandClient(fs.readFileSync('token.txt', 'utf8'), {}, {
    description: "An bot with the engine of math.js",
    owner: "A user",
    prefix: ["mjs!", "!mjs", "Mjs!", "! Mjs", "!Mjs", "! mjs", "! Mjs", "MJS!", "!MJS", "mjs1", "1mjs", "Mjs1", "1 Mjs", "1Mjs", "1 mjs", "1 Mjs", "MJS1", "1MJS", "@mention ", "@mention"],
	defaultHelpCommand: false
});

bot.on("ready", () => { // When the bot is ready
    console.log("Servers: " + bot.guilds.size + "." + " Logged in: " + bot.user.id);
    bot.editStatus("online", { name: "mjs!help", type: 3});
});

bot.registerCommand("help", (msg) => {
	bot.createMessage(msg.channel.id, {
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
					value: "The best command of the bot\n-- calc roll <num>: Roll a number\n-- calc flip: Flip a coin", // Field
					inline: false // Whether you want multiple fields in same line
				}
			],
            footer: { // Footer text
                text: "Don't include <> in the commands",
				icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
            }
		}
	});
}, {
	cooldown: 3000,
	cooldownMessage: "```markdown\n# Calm down, or I'll end up having problems. #```"
});
bot.registerCommandAlias("commands", "help");
bot.registerCommandAlias("info", "help");
bot.registerCommandAlias("HELP", "help");
bot.registerCommandAlias("Help", "help");

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
    var text = args.join(" "); // Make a string of the text after the command label
	try {
		if (isNaN(text) || !isFinite(text)) {
			try {
				result = math.eval(text);
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
								value: "```" + result + "```", // Field
								inline: true // Whether you want multiple fields in same line
							}
						],
						            footer: { // Footer text
                text: "Try to use the aliases of this command!",
				icon_url: "https://cdn.discordapp.com/avatars/264062457448759296/9375d757c7fe39d8d344b523ef9a08b8.png?size=256"
            }
					}
				});
			} catch (e) {
				bot.createMessage(msg.channel.id, e.toString());
			}
        } else {
			bot.createMessage(msg.channel.id, "A text or bug has been detected, try to use math accounts");
		}
	} catch (e) {
		bot.createMessage(msg.channel.id, e.toString());
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
							name: "ðŸŽ² You rolled",
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
		description: "**[Invite](https://discordapp.com/oauth2/authorize?client_id=538357066805411841&permissions=391232&redirect_uri=http%3A%2F%2Fmathjs.org%2Findex.html&scope=bot)**\n\n[Official server](https://discord.gg/67NkaBY)\n[Github](https://github.com/UPPERCASEuser/Math.js-bot)",
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

bot.connect();
