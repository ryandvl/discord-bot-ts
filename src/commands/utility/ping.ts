import DiscordClient from "../../DiscordClient";
import CommandStructure, { CommandProps } from "../../controller/Command";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);
  }

  async run({ interaction }: CommandProps["run"]) {
    interaction.reply({ content: "?", ephemeral: true });
  }
}
