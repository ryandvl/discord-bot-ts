import { Command } from "../../controller";

export default new Command({
  requirements: { botDeveloper },

  async run({ interaction }) {
    await interaction.reply({
      content: "Test command",
      ephemeral,
    });
  },
});
