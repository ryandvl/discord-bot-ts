import { Interaction } from "discord.js";

import config from "../../config";
import { CommandRunContextProps, CommandTypeNames } from "../types/command";
import { Event, Translator } from "../controller";

export default new Event({
  async run(interaction: Interaction) {
    if (
      interaction.isChatInputCommand() ||
      interaction.isContextMenuCommand()
    ) {
      let commandType: CommandTypeNames;

      if (interaction.isChatInputCommand()) commandType = "chatInput";
      else if (interaction.isMessageContextMenuCommand())
        commandType = "message";
      else if (interaction.isUserContextMenuCommand()) commandType = "user";
      else return;

      var commandTypes = {
        chatInput: this.slashCommands,
        user: this.userCommands,
        message: this.messageCommands,
      };

      const command = commandTypes[commandType].get(interaction.commandName);

      if (!command) return;

      const ctx: CommandRunContextProps = {
        userdb: await this.database.getOrCreate(1, interaction.user),
        db: this.database,
      };

      const locale = this.translation.locales.includes(interaction.locale)
          ? interaction.locale
          : "en-US",
        translator = new Translator(this, interaction, locale),
        t = translator.translate;

      //#region Permissions
      var required = {
        type: new String(),
        permissions: new Array(),
      };

      for (var guildPermission of command.requirements.guildPermissions ?? [])
        if (!interaction.appPermissions?.has(guildPermission)) {
          var permissionTranslated =
            this.translation.translations[locale]["permissions"][
              guildPermission
            ];

          required.type = "bot";
          required.permissions.push(permissionTranslated ?? guildPermission);
        }

      for (var memberPermission of command.requirements.memberPermissions ?? [])
        if (!interaction.memberPermissions?.has(memberPermission)) {
          var permissionTranslated =
            this.translation.translations[locale]["permissions"][
              memberPermission
            ];

          required.type = "member";
          required.permissions.push(permissionTranslated ?? memberPermission);
        }

      if (required.permissions.length && required.type)
        return await interaction.reply({
          content: t(`permissions:no_permission.${required.type}`, {
            permissions: required.permissions
              .map((permission) => `\`${permission}\``)
              .join(", "),
          }),
          ephemeral: true,
        });

      let type: string | null = null;

      if (
        command.requirements.botDeveloper &&
        !config.botDevelopers?.includes(interaction.user.id as never)
      )
        type = "botDeveloper";
      else if (command.requirements.botAdmin && !ctx.userdb.admin)
        type = "botAdmin";
      else if (command.requirements.premium && !ctx.userdb.premium.active)
        type = "premium";

      if (type)
        return await interaction.reply({
          content: t(`permissions:no_permission.${type}`),
          ephemeral: true,
        });
      //#endregion

      try {
        (command as any).run({ interaction, ctx, t, client: this });
      } catch (error) {
        await interaction.reply({
          content: t("events:interactionCreate.error"),
        });

        console.error(error);
      }
    }
  },
});
