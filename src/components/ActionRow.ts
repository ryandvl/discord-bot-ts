import { ActionRowBuilder, AnyComponentBuilder } from "discord.js";

const ActionRow = (components: Array<AnyComponentBuilder>) => {
  const actionRow = new ActionRowBuilder();

  actionRow.setComponents(components);

  return actionRow;
};

export default ActionRow;
