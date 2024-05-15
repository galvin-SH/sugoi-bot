const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Colors,
} = require('discord.js');
const { getMetrics } = require('./metrics');

module.exports = {
    SUGOIS_COMMAND: {
        builder: new SlashCommandBuilder()
            .setName('sugois')
            .setDescription('🦜すごい🦜すごい🦜アンビリーバボー🦜')
            .addSubcommand((user) =>
                user
                    .setName('user')
                    .setDescription('Get the sugois for a specific user.')
                    .addUserOption((user) =>
                        user
                            .setName('user')
                            .setDescription(
                                'The user to get sugois for. If omitted, gets your own sugois.'
                            )
                            .setRequired(false)
                    )
            )
            .addSubcommand((global) =>
                global
                    .setName('global')
                    .setDescription(
                        'Get a sugoi leaderboard across all servers.'
                    )
            )
            .addSubcommand(server => 
                server
                    .setName("server")
                    .setDescription(
                        "Get a sugoi leaderboard for this server."
                    )
            ),
        /**
         * @param {ChatInputCommandInteraction} interaction
         */
        handler: async (interaction) => {
            if (interaction.commandName != 'sugois')
                throw new Error(
                    `Expected to receive interaction for "sugois", got ${interaction.commandName} (${interaction.commandId})`
                );

            const subcommand = interaction.options.getSubcommand(true);

            const metrics = getMetrics();

            if (subcommand == 'user') {
                const user =
                    interaction.options.getUser('user', false) ??
                    interaction.user;

                /**
                 * @type {number | undefined}
                 */
                const userMetrics = metrics.users[user.id];

                if (!userMetrics) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setAuthor({
                                    name: user.displayName,
                                    iconURL: user.displayAvatarURL(),
                                })
                                .setDescription(
                                    "This user hasn't sugoied yet!"
                                ),
                        ],
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
                                    `Times sugoied: ${userMetrics}`
                                ),
                        ],
                    });
                }
            } else if (subcommand == 'all') {
                // sorting can take some time, so we defer our reply
                await interaction.deferReply();

                const total = metrics['total'];
                // this is pretty slow but probably fine for the scale we're working on.
                const topUsers = Object.entries(metrics.users)
                    .sort((a, b) => b[1] - a[1])
                    slice(0, 10)
                    .map(([id, sugois]) => ({
                        id,
                        sugois,
                    }));

                const embed = new EmbedBuilder()
                    .setColor(Colors.DarkGreen)
                    .setTitle('Sugois')
                    .setDescription(`Total: ${total}`)

                if (users.length > 0) {
                    embed.addFields({
                        name: 'Leaderboard',
                        value: topUsers
                            .map(
                                ({ id, sugois }, index) =>
                                    `${index + 1} - <@${id}>: ${sugois}`
                            )
                            .join('\n'),
                    });
                } else {
                    embed.addFields({
                        name: 'Leaderboard',
                        value: 'No users have sugoied yet!',
                    });
                }

                await interaction.editReply({
                    embeds: [embed],
                });
            } else if (subcommand == "server") {
                if (!interaction.inGuild()) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Red)
                                .setDescription(`:x: This command can only be used in servers.`)
                        ]
                    });
                }
                
                // sorting can take some time, so we defer our reply
                await interaction.deferReply();

                const total = metrics['total'];

                // guild may not be cached, and we need its name for the embed.
                const guild = await interaction.guild.fetch();
                const members = await guild.members.fetch();

                const topUsers = Object.entries(metrics.users)
                    .filter(([id]) => members.has(id)) // filter *before* sorting. should be marginally faster.
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([id, sugois]) => ({
                        id,
                        sugois,
                    }));

                const embed = new EmbedBuilder()
                    .setColor(Colors.DarkGreen)
                    .setTitle(`Sugois for ${guild.name}`)
                    .setDescription(`Total: ${total}`)

                if (topUsers.length > 0) {
                    embed.addFields({
                        name: 'Leaderboard',
                        value: topUsers
                            .map(
                                ({ id, sugois }, index) =>
                                    `${index + 1} - <@${id}>: ${sugois}`
                            )
                            .join('\n'),
                    });
                } else {
                    embed.addFields({
                        name: 'Leaderboard',
                        value: 'No users have sugoied yet!',
                    });
                }

                await interaction.editReply({
                    embeds: [embed],
                });
            } else {
                throw new Error(
                    `Unknown subcommand for "sugois": ${subcommand}`
                );
            }
        },
    },
};
