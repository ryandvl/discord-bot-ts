import DiscordClient from "../../DiscordClient";
import { Embed } from "../../components";
import CommandStructure, { CommandProps } from "../../controller/Command";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);
  }

  run = async ({ interaction, t }: CommandProps["run"]) => {
    let latencyColor = "#ff2929";

    if (this.client.ws.ping < 150) latencyColor = "#64ff29";
    else if (this.client.ws.ping < 250) latencyColor = "#ffab29";
    else if (this.client.ws.ping >= 250) latencyColor = "#ff2929";

    await interaction.reply({
      content: t("commands:ping.content"),
      embeds: [
        Embed({
          color: latencyColor as string,

          title: t("commands:ping.embed.title"),
          description: t("commands:ping.embed.description", {
            api: this.client.ws.ping == -1 ? 0 : this.client.ws.ping,
            database: await this.client.database.getPing(interaction.user.id),
            time_online: Math.floor(this.client.startTime / 1000),
          }),

          footer: {
            text: this.client.user!.tag as string,
            iconURL: this.client.user!.avatarURL() as string,
          },

          thumbnail: this.client.user!.avatarURL() as string,
          timestamp: Date.now(),
        }),
      ],
    });
  };
}
