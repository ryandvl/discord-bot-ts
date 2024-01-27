import { UserSelectMenuBuilder } from "discord.js";

export interface UserSelectMenuProps {
  id: string;
  placeholder: string;
  minValues?: number;
  maxValues?: number;
  users: string[];
  disabled?: boolean;
}

const UserSelectMenu = (options: UserSelectMenuProps) => {
  const userSelectMenu = new UserSelectMenuBuilder();

  if ("id" in options) userSelectMenu.setCustomId(options.id);

  if ("placeholder" in options)
    userSelectMenu.setPlaceholder(options.placeholder);

  if ("minValues" in options)
    userSelectMenu.setMinValues(options.minValues ?? 1);

  if ("maxValues" in options)
    userSelectMenu.setMaxValues(options.maxValues ?? 1);

  if ("defaultUsers" in options) userSelectMenu.setDefaultUsers(options.users);

  if ("disabled" in options) userSelectMenu.setDisabled(options.disabled);

  return userSelectMenu;
};

export default UserSelectMenu;
