import {
  ChannelType,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  PermissionResolvable,
  PermissionsString,
} from "discord.js";

import Translator from "../controller/Translator";
import DatabaseUtils from "../controller/Database";
import Command from "../controller/Command";
import DiscordClient from "../DiscordClient";

export interface CommandRequirementsProps {
  botDeveloper?: boolean;
  botAdmin?: boolean;
  guildPermissions?: PermissionsString[];
  memberPermissions?: PermissionsString[];
  premium?: boolean;
  default?: boolean;
}

export const OPTIONS_TYPES = {
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
} as const;

export type CommandOptionTypeNames = keyof typeof OPTIONS_TYPES;

export interface CommandOptionChoicesProps {
  name: string;
  name_localizations?: any;
  value: string;
}

export interface CommandOptionsProps {
  type: CommandOptionTypeNames;
  name: string;
  name_localizations?: any;
  description?: string;
  description_localizations?: any;
  required?: boolean;
  choices?: CommandOptionChoicesProps[];
  options?: CommandOptionsProps[];
  channel_types?: ChannelType[];
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
}

export interface CommandRunContextProps {
  db: DatabaseUtils;
  userdb: any;
}

export interface CommandRunProps<InteractionT> {
  interaction: InteractionT;
  ctx: CommandRunContextProps;
  t: Translator["translate"];
  client: DiscordClient;
}

export const COMMAND_TYPES = {
  chatInput: 1,
  user: 2,
  message: 3,
} as const;

export type CommandTypeNames = keyof typeof COMMAND_TYPES;

export interface ChatInputCommandConstructorProps {
  type?: "chatInput";
  options?: CommandOptionsProps[];
  nsfw?: boolean;
  dmPermission?: boolean;
  defaultMemberPermissions?: PermissionResolvable;

  run(
    this: Command & ChatInputCommandConstructorProps,
    props: CommandRunProps<ChatInputCommandInteraction>
  ): Promise<any>;
  requirements?: CommandRequirementsProps;
}

export interface MessageCommandConstructorProps {
  type: "message";
  name?: string;
  dmPermission?: boolean;
  defaultMemberPermissions?: PermissionResolvable;

  run(
    this: Command & MessageCommandConstructorProps,
    props: CommandRunProps<ContextMenuCommandInteraction>
  ): Promise<any>;
  requirements?: CommandRequirementsProps;
}

export interface UserCommandConstructorProps {
  type: "user";
  name?: string;
  dmPermission?: boolean;
  defaultMemberPermissions?: PermissionResolvable;

  run(
    this: Command & UserCommandConstructorProps,
    props: CommandRunProps<ContextMenuCommandInteraction>
  ): Promise<any>;
  requirements?: CommandRequirementsProps;
}

export type CommandConstructorProps =
  | ChatInputCommandConstructorProps
  | MessageCommandConstructorProps
  | UserCommandConstructorProps;
