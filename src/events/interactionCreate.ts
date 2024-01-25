import { Interaction } from "discord.js";
import EventStructure from "../controller/Event";

export default class Event extends EventStructure {
  run = (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run({ interaction });
    } catch (error) {
      console.error(error);
    }
  };
}
