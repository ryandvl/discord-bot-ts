import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from "discord.js";

export type Builders =
  | ButtonBuilder
  | ChannelSelectMenuBuilder
  | MentionableSelectMenuBuilder
  | RoleSelectMenuBuilder
  | StringSelectMenuBuilder
  | UserSelectMenuBuilder;

const ActionRow = (components: Array<Builders>): ActionRowBuilder<Builders> => {
  const actionRow = new ActionRowBuilder<Builders>();

  actionRow.setComponents(components);

  return actionRow;
};

export default ActionRow;
