import {
  ChatInputCommandInteraction,
  Permissions,
  SlashCommandBuilder,
} from "discord.js";
import DiscordClient from "../DiscordClient";
import Translator from "./Translator";

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
    t: Translator["translate"];
  };
}

export default class CommandStructure {
  client: DiscordClient;
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

  async run({ interaction, t }: CommandProps["run"]) {}
}
