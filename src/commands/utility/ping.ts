import DiscordClient from "../../DiscordClient";
import ActionRow from "../../components/ActionRow";
import Button from "../../components/Button";
import CommandStructure, { CommandProps } from "../../controller/Command";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);
  }

  run = async ({ interaction, t }: CommandProps["run"]) => {
    interaction.reply({
      content: t("commands:ping.embed.title", { ping: this.client.ws.ping }),
      ephemeral: true,
    });
  };
}
