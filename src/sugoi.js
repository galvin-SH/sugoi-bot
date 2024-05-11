const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { getMetrics } = require("./metrics");

module.exports = {
    SUGOIS_COMMAND: {
        builder: new SlashCommandBuilder()
            .setName("sugois")
            .setDescription("TODO")
            .addSubcommand(user => user
                .setName("user")
                .setDescription("Get the sugois for a specific user.")
                .addUserOption(user => user
                    .setName("user").setDescription("The user to get sugois for. If omitted, gets your own sugois.").setRequired(false)
                )
            )
            .addSubcommand(all => all
                .setName("all")
                .setDescription("Get total sugois, including a leaderboard.")
            ),
        /**
         * @param {ChatInputCommandInteraction} interaction
         */
        handler: async (interaction) => {
            if (interaction.commandName != "sugois") throw new Error(`Expected to receive interaction for "sugois", got ${interaction.commandName} (${interaction.commandId})`);

            const subcommand = interaction.options.getSubcommand(true);

            const metrics = getMetrics();

            if (subcommand == "user") {
                const user = interaction.options.getUser("user", false) ?? interaction.user;

                const userMetrics = metrics.users.find(({id}) => id == user.id);

                if (!userMetrics) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setAuthor({
                                    name: user.displayName,
                                    iconURL: user.displayAvatarURL(),
                                })
                                .setDescription("This user hasn't sugoied yet!")
                        ]
                    });
                } else {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.DarkGreen)
                                .setAuthor({
                                    name: user.displayName,
                                    iconURL: user.displayAvatarURL(),
                                })
                                .setDescription(
                                    `Times sugoied: ${userMetrics.sugois}`
                                ),
                        ],
                    });
                }

            } else if (subcommand == "all") {
                // sorting can take some time, so we defer our reply
                await interaction.deferReply();

                const total = metrics["times sugoied"];
                // this is pretty slow but probably fine for the scale we're working on.
                // TODO: probably filter by guild members, if command was used in a guild? Alternatively, add additional boolean option
                const topUsers = metrics.users.toSorted((a, b) => b.sugois - a.sugois).slice(0, 10);

                const embed = new EmbedBuilder()
                    .setColor(Colors.DarkGreen)
                    .setTitle("Sugois")
                    .setDescription(`Total: ${total}`)
                    .addFields({
                        name: "Leaderboard",
                        value: topUsers.map(({id, sugois}, index) => `${index + 1} - <@${id}>: ${sugois}`).join("\n")
                    });

                await interaction.editReply({
                    embeds: [embed],
                });
            } else {
                throw new Error(`Unknown subcommand for "sugois": ${subcommand}`);
            }
        }
    }
}