import { CollectedInteraction, ComponentType, Interaction } from "discord.js";
import DiscordClient from "../../DiscordClient";
import ActionRow from "../../components/ActionRow";
import Button from "../../components/Button";
import Collector from "../../components/Collector";
import Embed from "../../components/Embed";
import CommandStructure, { CommandProps } from "../../controller/Command";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);
  }

  run = async ({ interaction, ctx, t }: CommandProps["run"]) => {
    var reply = await interaction.reply({
      content: t("commands:ping.embed.title", {
        ping: this.client.ws.ping,
      }),
      embeds: [
        Embed({
          title: "test",
          description: "test2",
          color: "default",
          author: {
            name: "test3",
            iconURL: interaction.user.avatarURL() as string,
          },
          footer: {
            text: "test4",
            iconURL: interaction.user.avatarURL() as string,
          },
          image: interaction.user.avatarURL() as string,
          thumbnail: interaction.user.avatarURL() as string,
          timestamp: Date.now(),
          fields: [
            {
              name: "test5",
              value: "test6",
            },
            {
              name: "test7",
              value: "test8",
              inLine: true,
            },
          ],
        }),
      ],
      components: [
        ActionRow([
          Button({
            id: "button",
            label: "test",
          }),
        ]),
      ],
    });

    new Collector({
      response: reply,
      callbacks: {
        collect: (int: CollectedInteraction) => {
          int.reply({ content: "clicked!" });
        },
      },
      component: {
        id: "button",
        type: ComponentType.Button,
      },
    });
  };
}
