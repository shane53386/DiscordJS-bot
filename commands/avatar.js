const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription(
			"Get the avatar URL of the selected user, or your own avatar."
		)
		.addUserOption((option) =>
			option.setName("target").setDescription("The user's avatar to show.")
		),
	async execute(interaction) {
		const user = interaction.options.getUser("target") ?? interaction.user;
		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s avatar`)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setColor("#ffffff")
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });
	},
};
