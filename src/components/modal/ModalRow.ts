import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  UserSelectMenuBuilder,
} from "discord.js";

export type ModalBuilders =
  | ButtonBuilder
  | ChannelSelectMenuBuilder
  | MentionableSelectMenuBuilder
  | RoleSelectMenuBuilder
  | StringSelectMenuBuilder
  | UserSelectMenuBuilder
  | TextInputBuilder
  | AnyComponentBuilder;

const ModalRow = (
  components: Array<ModalBuilders>
): ActionRowBuilder<ModalBuilders> => {
  const modalRow = new ActionRowBuilder<ModalBuilders>();

  modalRow.setComponents(components);

  return modalRow;
};

export default ModalRow;
