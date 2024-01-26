import {
  APISelectMenuDefaultValue,
  MentionableSelectMenuBuilder,
  SelectMenuDefaultValueType,
} from "discord.js";

export interface MentionableSelectMenuProps {
  id: string;
  placeholder: string;
  minValues: number;
  maxValues: number;
  defaultValues: Array<
    | APISelectMenuDefaultValue<SelectMenuDefaultValueType.Role>
    | APISelectMenuDefaultValue<SelectMenuDefaultValueType.User>
  >;
  disabled: boolean;
}

const MentionableSelectMenu = (options: MentionableSelectMenuProps) => {
  const mentionableSelectMenu = new MentionableSelectMenuBuilder();

  if ("id" in options) mentionableSelectMenu.setCustomId(options.id);

  if ("placeholder" in options)
    mentionableSelectMenu.setPlaceholder(options.placeholder);

  if ("minValues" in options)
    mentionableSelectMenu.setMinValues(options.minValues);

  if ("maxValues" in options)
    mentionableSelectMenu.setMaxValues(options.maxValues);

  if ("defaultValues" in options)
    mentionableSelectMenu.setDefaultValues(options.defaultValues);

  if ("disabled" in options)
    mentionableSelectMenu.setDisabled(options.disabled);

  return mentionableSelectMenu;
};

export default MentionableSelectMenu;
