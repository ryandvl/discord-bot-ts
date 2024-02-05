import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from "discord.js";

import DiscordClient from "../DiscordClient";
import {
  CommandRequirementsProps,
  CommandOptionsProps,
  CommandConstructorProps,
  CommandTypeNames,
} from "../types/command";

export default class Command {
  client!: DiscordClient;

  requirements: CommandRequirementsProps;
  options?: CommandOptionsProps[];
  _options: CommandConstructorProps;

  data: SlashCommandBuilder | ContextMenuCommandBuilder;
  _data: any;

  type: CommandTypeNames;
  category!: string;

  path!: string;
  run: CommandConstructorProps["run"];

  constructor(options: CommandConstructorProps) {
    this.requirements = {
      botDeveloper: options.requirements?.botDeveloper ?? false,
      botAdmin: options.requirements?.botAdmin ?? false,
      guildPermissions: options.requirements?.guildPermissions ?? [],
      premium: options.requirements?.premium ?? false,
      default: options.requirements?.default ?? true,
    };

    this.type = options.type ?? "chatInput";
    switch (options.type) {
      case "message":
        this.data = new ContextMenuCommandBuilder();
        this.data.setType(ApplicationCommandType.Message);
        break;

      case "user":
        this.data = new ContextMenuCommandBuilder();
        this.data.setType(ApplicationCommandType.User);
        break;

      default:
        this.options = options.options ?? [];
        this.data = new SlashCommandBuilder();
    }

    this._options = options;

    this.run = options.run;
  }
}
