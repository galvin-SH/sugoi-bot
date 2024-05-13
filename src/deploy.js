#!/usr/bin/env node
require("dotenv").config();

const commands = [
    require("./sugois").SUGOIS_COMMAND.builder
];

const client = require("./client").getClient();


async function main() {
    await client.login(process.env.DISCORD_TOKEN);

    const debugGuild = process.env.DEBUG_GUILD;

    let guild;
    if (!debugGuild) {
        console.log("Deploying slash commands globally.");
    } else {
        guild = await client.guilds.fetch(debugGuild).catch(() => {});

        if (!guild) {
            console.error("Invalid DEBUG_GUILD. Not deploying any commands.");
            return;
        }

        console.log(`Deploying commands to ${guild.name} (${guild.id}).`);
    }

    // if we're supposed to be deploying to a guild, we only clean up commands in that guild
    const oldCommands = guild ? await guild.commands.fetch() : await client.application.commands.fetch();
    console.log(oldCommands.size > 0 ? `Cleaning up ${oldCommands.size} old commands: [${[...oldCommands.values()].map((command) => command.name).join(", ")}]` : "No old commands to clean up.");

    // clean up old commands
    for (const command of oldCommands.values()) {
        await client.application.commands.delete(command.id).catch(() => {});
    }

    // deploy new commands
    for (const command of commands) {
        console.log(`Deploying "/${command.name}".`);
        await client.application.commands.create(command, debugGuild);
    }
}


main().then(() => client.destroy());