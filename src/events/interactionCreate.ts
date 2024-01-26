import { Interaction } from "discord.js";
import EventStructure from "../controller/Event";
import Translator from "../controller/Translator";

export default class Event extends EventStructure {
  run = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.slashCommands.get(interaction.commandName);

    if (!command) return;

    const translator = new Translator(this.client, interaction, "pt-BR"),
      t = translator.translate;

    try {
      command.run({ interaction, t });
    } catch (error) {
      console.error(error);
    }
  };
}
