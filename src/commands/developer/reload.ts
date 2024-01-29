import DiscordClient from "../../DiscordClient";
import CommandStructure, { CommandProps } from "../../controller/Command";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);

    this.options = [
      {
        name: "command",
        type: "string",
        required: true,
      },
    ];
  }

  run = async ({ interaction, t }: CommandProps["run"]) => {
    await interaction.reply({
      content: "a",
    });
  };
}
