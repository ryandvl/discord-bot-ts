import { RoleSelectMenuBuilder } from "discord.js";

export interface RoleSelectMenuProps {
  id: string;
  placeholder: string;
  minValues: number;
  maxValues: number;
  defaultRoles: string[];
  disabled: boolean;
}

const RoleSelectMenu = (options: RoleSelectMenuProps) => {
  const roleSelectMenu = new RoleSelectMenuBuilder();

  if ("id" in options) roleSelectMenu.setCustomId(options.id);

  if ("placeholder" in options)
    roleSelectMenu.setPlaceholder(options.placeholder);

  if ("minValues" in options) roleSelectMenu.setMinValues(options.minValues);

  if ("maxValues" in options) roleSelectMenu.setMaxValues(options.maxValues);

  if ("defaultRoles" in options)
    roleSelectMenu.setDefaultRoles(options.defaultRoles);

  if ("disabled" in options) roleSelectMenu.setDisabled(options.disabled);

  return roleSelectMenu;
};

export default RoleSelectMenu;
