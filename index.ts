import { IntentsBitField } from "discord.js";
import { config } from "dotenv";

import "./src/types/global";
import { writeEventLine } from "./src/utils/ConsoleColorful";
import DiscordClient from "./src/DiscordClient";

// Use dotenv to get .env properties (BOT_TOKEN=...)
config();
writeEventLine(
  "&cConfiguration(s) &awas loaded successfully&white.",
  "system",
  "dotenv"
);

// Bot structure
const client = new DiscordClient({
  intents: [
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.DirectMessages,
  ],
});

// Initialize bot systems
client.start();

writeEventLine(
  "&cClient System(s) &awas loaded successfully&white.",
  "system",
  "client"
);
