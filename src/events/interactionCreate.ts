import { Interaction } from "discord.js";
import EventStructure from "../controller/Event";
import Translator from "../controller/Translator";
import { ContextProps } from "../controller/Command";
import config from "../../config";

export default class Event extends EventStructure {
  run = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.slashCommands.get(interaction.commandName);

    if (!command) return;

    const ctx: ContextProps = {
      userdb: await this.client.database.getOrCreate(1, interaction.user),
      db: this.client.database,
    };

    const locale = this.client.translation.locales.includes(interaction.locale)
        ? interaction.locale
        : "en-US",
      translator = new Translator(this.client, interaction, locale),
      t = translator.translate;

    //#region Permissions
    var required = {
      type: new String(),
      permissions: new Array(),
    };

    for (var guildPermission of command.requirements.guildPermissions ?? [])
      if (!interaction.appPermissions?.has(guildPermission)) {
        var permissionTranslated =
          this.client.translation.translations[locale]["permissions"][
            guildPermission
          ];

        required.type = "bot";
        required.permissions.push(permissionTranslated ?? guildPermission);
      }

    for (var memberPermission of command.requirements.memberPermissions ?? [])
      if (!interaction.memberPermissions?.has(memberPermission)) {
        var permissionTranslated =
          this.client.translation.translations[locale]["permissions"][
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
      command.run({ interaction, ctx, t });
    } catch (error) {
      await interaction.reply({ content: t("events:interactionCreate.error") });
      console.error(error);
    }
  };
}
