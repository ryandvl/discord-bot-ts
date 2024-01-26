import { ChannelSelectMenuBuilder, ChannelType } from "discord.js";

export interface ChannelSelectMenuProps {
  id: string;
  placeholder: string;
  minValues: number;
  maxValues: number;
  defaultChannels: string[];
  channelsTypes: ChannelType[];
  disabled: boolean;
}

const ChannelSelectMenu = (options: ChannelSelectMenuProps) => {
  const channelSelectMenu = new ChannelSelectMenuBuilder();

  if ("id" in options) channelSelectMenu.setCustomId(options.id);

  if ("placeholder" in options)
    channelSelectMenu.setPlaceholder(options.placeholder);

  if ("minValues" in options) channelSelectMenu.setMinValues(options.minValues);

  if ("maxValues" in options) channelSelectMenu.setMaxValues(options.maxValues);

  if ("defaultChannels" in options)
    channelSelectMenu.setDefaultChannels(options.defaultChannels);

  if ("channelTypes" in options)
    channelSelectMenu.setChannelTypes(options.channelsTypes);

  if ("disabled" in options) channelSelectMenu.setDisabled(options.disabled);

  return channelSelectMenu;
};

export default ChannelSelectMenu;
