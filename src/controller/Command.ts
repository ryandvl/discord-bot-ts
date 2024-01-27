import {
  ChatInputCommandInteraction,
  PermissionsString,
  SlashCommandBuilder,
} from "discord.js";
import DiscordClient from "../DiscordClient";
import Translator from "./Translator";
import DatabaseUtils from "../utils/Database";

export interface RequirementsProps {
  botDeveloper?: boolean;
  botAdmin?: boolean;
  guildPermissions?: PermissionsString[];
  memberPermissions?: PermissionsString[];
  premium?: boolean;
  server_boost?: boolean;
  default?: boolean;
}

export interface ContextProps {
  db: DatabaseUtils;
  userdb: any;
}

export interface CommandProps {
  run: {
    interaction: ChatInputCommandInteraction;
    ctx: ContextProps;
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

  async run({ interaction, ctx, t }: CommandProps["run"]) {}
}
