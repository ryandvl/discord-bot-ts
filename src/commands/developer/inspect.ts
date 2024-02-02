import { join } from "path";
import DiscordClient from "../../DiscordClient";
import CommandStructure, {
  CommandProps,
  OptionsProps,
} from "../../controller/Command";
import { readdirSync } from "fs";
import {
  ActionRow,
  Button,
  Collector,
  Embed,
  Modal,
  ModalRow,
  StringSelectMenu,
  TextInput,
} from "../../components";
import {
  AnySelectMenuInteraction,
  InteractionResponse,
  Message,
  ModalSubmitInteraction,
  SelectMenuComponentOptionData,
} from "discord.js";
import { spaceString } from "../../utils/Text";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);

    this.requirements = {
      botDeveloper: true,
    };

    this.options = (() => {
      let models: OptionsProps[] = [];

      var categoryDir = join(__dirname, "..", "..", "database", "models");
      for (var model of readdirSync(categoryDir)) {
        let modelName = model.split(".")[0].toLowerCase();
        models.push({
          name: modelName,
          type: "sub_command",
          options: [
            {
              name: "id",
              type: "string",
              required: true,
            },
          ],
        });
      }

      return models;
    })();
  }

  run = async ({ interaction, ctx, t }: CommandProps["run"]) => {
    const [type, id] = [
      interaction.options.getSubcommand(true),
      interaction.options.getString("id", true),
    ];

    var user = this.client.users.cache.get(id);

    if (!(await ctx.db.exists(type, id)) || !user)
      return await interaction.reply({
        content: t("commands:inspect.no_exists"),
        ephemeral: true,
      });

    var data = await ctx.db.get(type, user);
    var defaultDatabase = data._doc;

    await interaction.deferReply({ fetchReply: true });

    let pagePath: string[] = [];

    var reply: Message<boolean>;
    var database: any = defaultDatabase;

    const showPage = async () => {
      database = defaultDatabase;
      for (var page of pagePath) database = database[page];

      let content = {
        components: [
          ActionRow([
            Button({
              id: "back",
              style: "secondary",
              label: t("commands:inspect.components.back"),
              emoji: "⬅️",
            }),
          ]),
          ActionRow([
            StringSelectMenu({
              id: "type",
              placeholder: "Select type to inspect",
              options: (() => {
                let array: SelectMenuComponentOptionData[] = [];

                for (var key in database)
                  if (Object.prototype.hasOwnProperty.call(database, key))
                    array.push({
                      label: key,
                      value: key,
                    });

                return array;
              })(),
            }),
          ]),
        ],
        embeds: [
          Embed({
            title: t("commands:inspect.embed.title"),
            description: (() => {
              let array: string[] = [];

              for (var key in database)
                if (Object.prototype.hasOwnProperty.call(database, key)) {
                  var element = database[key];

                  let [elementInfo, elementType] = ["", ""];

                  if (Array.isArray(element)) {
                    elementInfo = `[...${element.length}]`;
                    elementType = "array";
                  } else
                    switch (typeof element) {
                      case "boolean":
                        elementInfo = `${element}`;
                        elementType = "boolean";
                        break;

                      case "number":
                        elementInfo = element.toString();
                        elementType = "number";
                        break;

                      case "string":
                        elementInfo = element;
                        elementType = "string";
                        break;

                      case "object":
                        elementInfo = `{...${Object.keys(element).length}}`;
                        elementType = "object";
                        break;

                      default:
                        elementInfo = "???";
                        elementType = "undefined";
                        break;
                    }

                  array.push(
                    t("commands:inspect.embed.description", {
                      key: key,
                      info: elementInfo,
                      type: elementType,
                    })
                  );
                }

              return array.join("\n");
            })(),
            footer: {
              text: t("commands:inspect.embed.footer", {
                path: `${type}/${id}/${pagePath.join("/")}`,
              }),
            },
            color: "invisible",
          }),
        ],
      };

      if (!reply) {
        reply = await interaction.editReply(content);
        var buttonCollector = new Collector({
          response: reply,
          interaction,
          callbacks: {
            collect: async (i) => {
              switch (i.customId) {
                case "back":
                  pagePath = pagePath.slice(0, pagePath.length - 1);
                  break;

                default:
                  return;
              }

              await i.deferUpdate();
              showPage();
              buttonCollector.collector.resetTimer();
            },
          },
          component: {
            type: "button",
          },
        });

        var menuCollector = new Collector({
          response: reply,
          interaction,
          callbacks: {
            collect: async (i) => {
              switch (i.customId) {
                case "type":
                  pagePath = [...pagePath, i.values[0]];
                  break;

                default:
                  return;
              }

              if (typeof database[i.values[0]] !== "object") {
                await i.showModal(
                  Modal({
                    title: t("commands:inspect.modal.title"),
                    id: "inspect_change",
                    components: [
                      ModalRow([
                        TextInput({
                          id: "inspect_change-value",
                          label: t("commands:inspect.modal.value.label"),
                          placeholder: t(
                            "commands:inspect.modal.value.placeholder"
                          ),
                          style: "paragraph",
                        }),
                      ]),
                    ],
                  })
                );

                const filter = (int: ModalSubmitInteraction) =>
                  int.customId == `inspect_change` &&
                  int.user.id == interaction.user.id;

                const modalInteraction = await interaction.awaitModalSubmit({
                  filter,
                  time: 600000,
                });

                var value = modalInteraction.fields.getTextInputValue(
                  "inspect_change-value"
                );

                let newData = data;

                for (let i = 0; i < pagePath.length - 1; i++) {
                  let key = pagePath[i];

                  if (newData[key] && typeof newData[key] === "object")
                    newData = newData[key];
                }

                var lastKey = pagePath[pagePath.length - 1];
                let newValue;

                switch (typeof newData[lastKey]) {
                  case "boolean":
                    newValue = Boolean(value) ?? false;
                    break;

                  case "string":
                    newValue = value;
                    break;

                  case "number":
                    newValue = Number(value) ?? 0;
                    break;
                }

                newData[lastKey] = newValue;

                data.save();

                data = await ctx.db.get(type, user);
                defaultDatabase = data._doc;

                pagePath = pagePath.slice(0, pagePath.length - 1);

                await modalInteraction.reply({
                  content: t("commands:inspect.modal.success"),
                  ephemeral: true,
                });
                showPage();
                menuCollector.collector.resetTimer();
                return;
              }

              await i.deferUpdate();
              showPage();
              menuCollector.collector.resetTimer();
            },
          },
          component: {
            type: "stringSelect",
          },
        });
      } else await reply.edit(content);
    };

    showPage();
  };
}
