# sugoi-bot

![MIT License](https://img.shields.io/badge/License-MIT%20License-blue)

## Description

Silly discord bot that reacts to messages with sugoi among other things. This bot is a personal project and is not intended for public use.

## Table of Contents

-   [Installation and Setup](<#installation and setup>)
-   [Usage](#usage)
-   [License](#license)
-   [How to Contribute](#contributing)
-   [Tests](#tests)
-   [Questions](#questions)

## Installation and Setup

After cloning repo, install node dependancies with `npm install` in the root of the project.

Create a `.env` file in the root of the project with the following contents:

`DISCORD_TOKEN={YOUR_DISCORD_BOT_TOKEN}`

## Usage

The bot can be started with `npm start` in the root of the project. The bot will then be online and listening for messages in the discord server it is connected to.

A metrics.json file will be created in the root of the project that will track:

-   Total messages reacted to
-   Total sugoi reactions by each individual user

To run the bot in the background, use the command `nohup npm start &` in the root of the project. Then the terminal can be closed and the bot will continue to run.

## License

This project is licenced under [MIT License](https://choosealicense.com/licenses/mit)

## Contributing

This project is not currently seeking any collaborators

## Tests

This project does not currently implement any test functionality

## Credits

This project started as a joke spinning off of [Mampfinator aka Sir Eatsalot](https://github.com/Mampfinator)'s [project](https://github.com/Mampfinator/preview-bot)

## Questions

If you have any questions or concerns regarding this project, my github profile can be located by using the following link
https://github.com/galvin-sh
