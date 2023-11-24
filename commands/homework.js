const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const ical = require("node-ical");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("homework")
		.setDescription("Get homework."),
	async execute(interaction) {
		const mcv =
			"https://www.mycourseville.com/?q=courseville/ical/302300-JOFYYNVX2PIS3VQJ97WT";
		ical.fromURL(mcv, {}, async (err, data) => {
			let work, deadline;
			let date = Date.now();
			const events = [];
			for (let k in data) {
				const event = data[k];
				if (
					event.type == "VEVENT" &&
					!event.summary.search("Assignment") &&
					event.end > date
				) {
					work = `${event.summary.slice(
						event.summary.search(":") + 2
					)}`;
					deadline = `Due to ${event.end.toLocaleString("th-TH")}`;
					events.push({ work, deadline });
				}
			}
			const embed = new EmbedBuilder()
				.setColor("#ffffff")
				.setTitle("Homework")
				.setThumbnail(
					"https://www.mycourseville.com/sites/all/modules/courseville/files/logo/cv-logo.png"
				)
				.addFields(
					events.map((event) => {
						return {
							name: event.work,
							value: event.deadline,
							inline: false,
						};
					})
				)
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		});
	},
};
