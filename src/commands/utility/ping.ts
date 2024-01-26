import DiscordClient from "../../DiscordClient";
import CommandStructure, { CommandProps } from "../../controller/Command";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);
  }

  run = async ({ interaction, ctx, t }: CommandProps["run"]) => {
    interaction.reply({
      content: t("commands:ping.embed.title", {
        ping: await ctx.db.exists(1, "276407955413532672"),
      }),
    });
  };
}
