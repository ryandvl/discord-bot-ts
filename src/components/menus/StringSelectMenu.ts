import {
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export interface StringSelectMenuProps {
  id: string;
  placeholder: string;
  minValues: number;
  maxValues: number;
  options: SelectMenuComponentOptionData[];
  disabled: boolean;
}

const StringSelectMenu = (options: StringSelectMenuProps) => {
  const stringSelectMenu = new StringSelectMenuBuilder();

  if ("id" in options) stringSelectMenu.setCustomId(options.id);

  if ("placeholder" in options)
    stringSelectMenu.setPlaceholder(options.placeholder);

  if ("minValues" in options) stringSelectMenu.setMinValues(options.minValues);

  if ("maxValues" in options) stringSelectMenu.setMaxValues(options.maxValues);

  for (var option of options.options) {
    const stringSelectMenuOptionBuilder = new StringSelectMenuOptionBuilder(
      option
    );

    stringSelectMenu.addOptions(stringSelectMenuOptionBuilder);
  }

  if ("disabled" in options) stringSelectMenu.setDisabled(options.disabled);

  return stringSelectMenu;
};

export default StringSelectMenu;
