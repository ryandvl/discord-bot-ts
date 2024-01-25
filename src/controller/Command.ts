import {
  ChatInputCommandInteraction,
  CommandInteraction,
  Permissions,
  SlashCommandBuilder,
} from "discord.js";
import DiscordClient from "../DiscordClient";

interface RequirementsProps {
  botDeveloper?: boolean;
  botAdmin?: boolean;
  guildPermissions?: Permissions[];
  premium?: boolean;
  server_boost?: boolean;
  default?: boolean;
}

export interface CommandProps {
  run: {
    interaction: ChatInputCommandInteraction;
  };
}

export default class CommandStructure {
  client: DiscordClient | null;
  requirements: RequirementsProps;
  data: SlashCommandBuilder;
  constructor(client: DiscordClient) {
    this.client = client;

    this.requirements = {
      botDeveloper: false,
      botAdmin: false,
      guildPermissions: [],
      premium: false,
      server_boost: false,
      default: true,
    };

    this.data = new SlashCommandBuilder();
  }

  async run({ interaction }: CommandProps["run"]) {}
}
