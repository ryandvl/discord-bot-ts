import { existsSync } from "fs";
import DiscordClient from "../../DiscordClient";
import CommandStructure, { CommandProps } from "../../controller/Command";
import path from "path";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);

    this.options = [
      {
        name: "command",
        type: "sub_command",
        required: true,
        options: [
          {
            name: "command_name",
            type: "string",
            required: true,
          },
        ],
      },
      {
        name: "file",
        type: "sub_command",
        required: true,
        options: [
          {
            name: "file_name",
            type: "string",
            required: true,
          },
        ],
      },
    ];
  }

  run = async ({ interaction, t }: CommandProps["run"]) => {
    switch (interaction.options.getSubcommand(true)) {
      case "command":
        const command = interaction.options.getString("command_name", true);

        if (!this.client.slashCommands.get(command.toLowerCase()))
          return await interaction.reply({
            content: "Comando não existe",
            ephemeral: true,
          });

        var isReloaded = await this.client.reloadCommand(command.toLowerCase());

        if (isReloaded)
          await interaction.reply({ content: "reiniciado", ephemeral: true });
        else
          await interaction.reply({
            content: "não reiniciou",
            ephemeral: true,
          });
        break;

      case "file":
        const file = interaction.options.getString("file_name", true);

        if (!existsSync(file))
          return await interaction.reply({
            content: "não existe o arquivo",
            ephemeral: true,
          });

        var filePath = path.join(__dirname, "..", "..", "..", file);

        try {
          delete require.cache[require.resolve(filePath)];
        } catch (error) {
          return await interaction.reply({
            content: "deu erro, não existe",
            ephemeral: true,
          });
        }

        await interaction.reply({
          content: "arquivo reiniciado",
          ephemeral: true,
        });
        break;

      default:
        await interaction.reply({
          content: "tipo não existe",
          ephemeral: true,
        });
    }
  };
}
