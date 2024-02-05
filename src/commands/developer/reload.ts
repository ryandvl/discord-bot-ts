import { join } from "path";
import { Command } from "../../controller";
import { existsSync, readdirSync } from "fs";
import { CommandOptionChoicesProps } from "../../types/command";

export default new Command({
  requirements: { botDeveloper },
  options: [
    {
      name: "command",
      type: "sub_command",
      options: [
        {
          name: "command_name",
          type: "string",
          choices: (() => {
            let commands: CommandOptionChoicesProps[] = [];

            var categoryDir = join(__dirname, "..");
            for (var category of readdirSync(categoryDir))
              for (var command of readdirSync(join(categoryDir, category))) {
                let commandName = command.split(".")[0];
                commands.push({
                  name: commandName,
                  value: commandName,
                });
              }

            return commands.length <= 25 ? commands : undefined;
          })(),
          required: true,
        },
      ],
    },
    {
      name: "file",
      type: "sub_command",
      options: [
        {
          name: "file_name",
          type: "string",
          required: true,
        },
      ],
    },
  ],

  async run({ interaction, t }) {
    switch (interaction.options.getSubcommand(true)) {
      case "command":
        const command = interaction.options.getString("command_name", true);

        if (!this.client.getCommand(command.toLowerCase()))
          return await interaction.reply({
            content: t("commands:reload.command.invalid"),
            ephemeral: true,
          });

        var isReloaded = await this.client.reloadCommand(command.toLowerCase());

        if (isReloaded)
          await interaction.reply({
            content: t("commands:reload.command.reloaded"),
            ephemeral: true,
          });
        else
          await interaction.reply({
            content: t("commands:reload.command.error"),
            ephemeral: true,
          });
        break;

      case "file":
        const file = interaction.options.getString("file_name", true);

        if (!existsSync(file))
          return await interaction.reply({
            content: t("commands:reload.file.invalid"),
            ephemeral: true,
          });

        var filePath = join(__dirname, "..", "..", "..", file);

        try {
          delete require.cache[require.resolve(filePath)];
        } catch (error) {
          return await interaction.reply({
            content: t("commands:reload.file.error"),
            ephemeral: true,
          });
        }

        await interaction.reply({
          content: t("commands:reload.file.reloaded"),
          ephemeral: true,
        });
        break;
    }
  },
});
