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
  _data: any;

  path?: string;

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
