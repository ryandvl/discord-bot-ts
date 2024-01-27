import { Interaction } from "discord.js";
import EventStructure from "../controller/Event";
import Translator from "../controller/Translator";
import { ContextProps } from "../controller/Command";

export default class Event extends EventStructure {
  run = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.slashCommands.get(interaction.commandName);

    if (!command) return;

    const ctx: ContextProps = {
      userdb: await this.client.database.getOrCreate(1, interaction.user),
      db: this.client.database,
    };

    const translator = new Translator(
        this.client,
        interaction,
        ctx.userdb.language
      ),
      t = translator.translate;

    try {
      command.run({ interaction, ctx, t });
    } catch (error) {
      await interaction.reply({ content: t("events:interactionCreate.error") });
      console.error(error);
    }
  };
}
