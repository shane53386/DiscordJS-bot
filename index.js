const Discord = require("discord.js");
const config = require("./config.json");
const ical = require("node-ical");
const client = new Discord.Client();
const prefix = require("discord-prefix");

let guildPrefix = config.PREFIX;

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	let gPrefix = prefix.getPrefix(message.guild.id);
	if (gPrefix) guildPrefix = gPrefix;

	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(guildPrefix)) return;

	const commandBody = message.content.slice(guildPrefix.length);
	const args = commandBody.split(" ");
	const command = args.shift().toLowerCase();

	if (command === "hi") {
		message.react("👋");
		message.channel.send(`Hi! ${message.author.username}`);
	} else if (command === "help") {
		helpCommand(message);
	} else if (command === "info") {
		userInfo(message);
	} else if (command === "hw") {
		homework(message);
	} else if (command === "setprefix") {
		changePrefix(message, args[0]);
	} else {
		message.channel.send(`Unknown command! Try ${guildPrefix}help`);
		helpCommand(message);
	}
});

function helpCommand(message) {
	let embed = new Discord.MessageEmbed();
	embed.setColor("RANDOM");
	embed.setTitle(`${message.guild.name}'s command`);
	embed.addFields(
		{ name: "Prefix", value: guildPrefix, inline: false },
		{ name: "User's info", value: "info", inline: false },
		{ name: "Homework", value: "hw", inline: false },
		{ name: "Set prefix", value: "setprefix", inline: false }
	);
	embed.setTimestamp();
	message.channel.send(embed);
	message.react("🆘");
}

function userInfo(message) {
	let embed = new Discord.MessageEmbed();
	embed.setColor("RANDOM");
	embed.setThumbnail(message.author.avatarURL());
	embed.setTitle(`${message.author.username}'s info`);
	embed.setTimestamp();
	message.channel.send(embed);
	message.react("ℹ");
}

function homework(message) {
	const mcv =
		"https://www.mycourseville.com/?q=courseville/ical/302300-JOFYYNVX2PIS3VQJ97WT";
	ical.fromURL(mcv, {}, (err, data) => {
		let embed = new Discord.MessageEmbed();
		let work, dateline;
		embed.setColor("RANDOM");
		embed.setTitle("Homework");
		let date = Date.now();
		for (let k in data) {
			const event = data[k];
			if (
				event.type == "VEVENT" &&
				!event.summary.search("Assignment") &&
				event.end > date
			) {
				work = `${event.summary.slice(event.summary.search(":") + 2)}`;
				dateline = `Due to ${event.end.toLocaleTimeString(
					"th-TH"
				)} ${event.end.toLocaleDateString("th-TH")}\n`;
				embed.addField(work, dateline, false);
			}
		}
		embed.setTimestamp();
		message.channel.send(embed);
	});
	message.react("📚");
}

function changePrefix(message, nPrefix) {
	prefix.setPrefix(nPrefix, message.guild.id);
	message.channel.send(`Set new prefix to ${nPrefix}`);
	message.react("👍");
}

client.login(config.BOT_TOKEN);
