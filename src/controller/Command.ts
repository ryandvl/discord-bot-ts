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
  default?: boolean;
}

export interface ChoicesProps {
  name: string;
  value: string;
}

export interface OptionsProps {
  name: string;
  description?: string;
  type: string;
  required?: boolean;
  choices?: ChoicesProps[];
  options?: OptionsProps[];
}

interface OptionsTypeStringProps {
  [key: string]: number;
}

export const optionsType: OptionsTypeStringProps = {
  sub_command: 1,
  sub_command_group: 2,
  string: 3,
  integer: 4,
  boolean: 5,
  user: 6,
  channel: 7,
  role: 8,
  mentionable: 9,
  number: 10,
  attachment: 11,
};

export interface OptionsTypeFunctionProps {
  [key: string]: Function;
}

export const optionsFunctions: OptionsTypeFunctionProps = {
  sub_command: (builder: SlashCommandBuilder) => builder.addSubcommand,
  sub_command_group: (builder: SlashCommandBuilder) =>
    builder.addSubcommandGroup,
  string: (builder: SlashCommandBuilder) => builder.addStringOption,
  integer: (builder: SlashCommandBuilder) => builder.addIntegerOption,
  boolean: (builder: SlashCommandBuilder) => builder.addBooleanOption,
  user: (builder: SlashCommandBuilder) => builder.addUserOption,
  channel: (builder: SlashCommandBuilder) => builder.addChannelOption,
  role: (builder: SlashCommandBuilder) => builder.addRoleOption,
  mentionable: (builder: SlashCommandBuilder) => builder.addMentionableOption,
  number: (builder: SlashCommandBuilder) => builder.addNumberOption,
  attachment: (builder: SlashCommandBuilder) => builder.addAttachmentOption,
};

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
  options: OptionsProps[];

  data: SlashCommandBuilder;

  constructor(client: DiscordClient) {
    this.client = client;

    this.options = [];
    this.requirements = {
      botDeveloper: false,
      botAdmin: false,
      guildPermissions: [],
      premium: false,
      default: true,
    };

    this.data = new SlashCommandBuilder();
  }

  async run({ interaction, ctx, t }: CommandProps["run"]): Promise<any> {}
}
