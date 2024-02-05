import { ModalSubmitInteraction } from "discord.js";

import { Embed, Modal, ModalRow, TextInput } from "../../components";
import { Command } from "../../controller";

export default new Command({
  requirements: { botDeveloper },

  async run({ interaction, t, client }) {
    await interaction.showModal(
      Modal({
        title: t("commands:eval.modal.title"),
        id: "eval_command",
        components: [
          ModalRow([
            TextInput({
              id: "code",
              label: t("commands:eval.modal.code.label"),
              placeholder: t("commands:eval.modal.code.placeholder"),
              style: "paragraph",
            }),
          ]),
        ],
      })
    );

    const filter = (int: ModalSubmitInteraction) =>
      int.customId == `eval_command` && int.user.id == interaction.user.id;

    const modalInteraction = await interaction.awaitModalSubmit({
      filter,
      time: 600000,
    });

    var code = modalInteraction.fields.getTextInputValue("code");

    let result = new String(),
      resultType;
    try {
      let output = await eval(code);
      resultType = typeof output;

      output = require("util").inspect(output, { depth: 1 });

      result = output;
    } catch (error) {
      result = `${error}`;
      resultType = typeof error;
    }

    if (result.length > 4000)
      result =
        result.slice(0, 4000) +
        `\n...[${result.slice(4000).length} ${t(
          "commands:eval.embed.description"
        )}]`;

    await modalInteraction.reply({
      embeds: [
        Embed({
          title: t("commands:eval.embed.title", {
            resultType,
          }),
          description: (("```js\n" + result) as string) + "```",
          color: "invisible",
        }),
      ],
      ephemeral: true,
    });
  },
});
