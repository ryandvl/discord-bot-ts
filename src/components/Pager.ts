import {
  ChannelSelectMenuBuilder,
  ChatInputCommandInteraction,
  MentionableSelectMenuBuilder,
  Message,
  MessageEditOptions,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from "discord.js";

import DiscordClient from "../DiscordClient";
import Translator from "../controller/Translator";
import Embed from "./Embed";
import ActionRow from "./ActionRow";
import Button from "./Button";
import StringSelectMenu from "./menus/StringSelectMenu";
import Collector from "./Collector";

type MenuBuilderTypes =
  | ChannelSelectMenuBuilder
  | MentionableSelectMenuBuilder
  | RoleSelectMenuBuilder
  | StringSelectMenuBuilder
  | UserSelectMenuBuilder;

type EventFunctionType = (pager: Pager, values: string[]) => MessageEditOptions;

interface PagerOptionsProps {
  client: DiscordClient;
  interaction: ChatInputCommandInteraction;
  translate: Translator["translate"];

  settings?: {
    selectMenu?: boolean;
    toFirstPage?: boolean;
    toBackPage?: boolean;
    toNextPage?: boolean;
    toLastPage?: boolean;
  };

  items: any[];
  itemsPerPage?: number;

  events?: {
    changePage?: EventFunctionType;
    selectOption?: (pager: Pager, values: string[]) => any;

    toFirstPage?: (pager: Pager) => any;
    toBackPage?: (pager: Pager) => any;
    toNextPage?: (pager: Pager) => any;
    toLastPage?: (pager: Pager) => any;
  };
}

export default class Pager {
  client: PagerOptionsProps["client"];
  interaction: PagerOptionsProps["interaction"];
  translate: PagerOptionsProps["translate"];

  message: Message<boolean> | undefined;

  settings: PagerOptionsProps["settings"];

  page: number;
  pages: any[][];
  option: number;

  items: PagerOptionsProps["items"];
  itemsPerPage: PagerOptionsProps["itemsPerPage"];

  events: Required<PagerOptionsProps["events"]>;

  collectors: { menu: Collector; button: Collector } | undefined;

  constructor(options: PagerOptionsProps) {
    this.client = options.client;
    this.interaction = options.interaction;
    this.translate = options.translate;

    this.settings = options.settings;

    this.page = 0;
    this.pages = [];
    this.option = 0;

    this.items = options.items;
    this.itemsPerPage = options.itemsPerPage ?? 10;

    this.getPages();

    this.events = {
      changePage:
        options.events?.changePage ??
        ((pager) => {
          let messageData: MessageEditOptions = {
            embeds: [
              Embed({
                description: pager.pageItems.length
                  ? pager.pageItems.join("\n")
                  : "???",
                color: "default",
                footer: {
                  text: `${pager.page}/${pager.pages.length} (${pager.items.length})`,
                },
              }),
            ],
            components: [
              ActionRow([
                StringSelectMenu({
                  id: "selectOption",
                  placeholder: "Select option",
                  options: pager.pageItems.map((page, index) => ({
                    label: page,
                    value: `${index}-${page}`,
                  })),
                }),
              ]),
              ActionRow([
                Button({
                  id: "firstPage",
                  emoji: "⏪",
                  disabled: pager.page == 1,
                }),
                Button({
                  id: "backPage",
                  emoji: "⬅️",
                  disabled: pager.page == 1,
                }),
                Button({
                  id: "nextPage",
                  emoji: "➡️",
                  disabled: !(pager.page < pager.pages.length),
                }),
                Button({
                  id: "lastPage",
                  emoji: "⏩",
                  disabled: !(pager.page < pager.pages.length),
                }),
              ]),
            ],
          };

          return messageData;
        }),
      selectOption:
        options.events?.selectOption ??
        ((pager) => {
          let messageData: MessageEditOptions = {
            embeds: [
              Embed({
                description: `Item: ${pager.getOption}`,
                color: "default",
              }),
            ],
            components: [
              ActionRow([
                Button({
                  id: "backToPages",
                  emoji: "◀",
                }),
              ]),
            ],
          };

          return messageData;
        }),

      toFirstPage: options.events?.toFirstPage ?? (() => {}),
      toBackPage: options.events?.toBackPage ?? (() => {}),
      toNextPage: options.events?.toNextPage ?? (() => {}),
      toLastPage: options.events?.toLastPage ?? (() => {}),
    };

    this.start();
  }

  get pageItems(): any[] {
    return this.pages[this.page - 1];
  }

  get getOption(): any[] {
    return this.pages[this.page - 1][this.option];
  }

  async start() {
    if (!this.interaction.deferred)
      await this.interaction.deferReply({ fetchReply: true });

    await this.changePage();

    this.collectors = {
      menu: new Collector({
        interaction: this.interaction,
        response: this.message!,
        callbacks: {
          collect: async (int) => {
            switch (int.customId) {
              case "selectOption":
                await this.selectOption(int.values);
                break;

              default:
                return;
            }

            await int.deferUpdate();
            this.collectors!.menu.collector.resetTimer();
          },
        },
        component: {
          type: "stringSelect",
        },
      }),
      button: new Collector({
        interaction: this.interaction,
        response: this.message!,
        callbacks: {
          collect: async (int) => {
            switch (int.customId) {
              case "firstPage":
                this.toFirstPage();
                break;

              case "backPage":
                this.toBackPage();
                break;

              case "nextPage":
                this.toNextPage();
                break;

              case "lastPage":
                this.toLastPage();
                break;

              case "backToPages":
                this.backToPages();
                break;

              default:
                return;
            }

            await int.deferUpdate();
            this.collectors!.button.collector.resetTimer();
          },
        },
        component: {
          type: "button",
        },
      }),
    };
  }

  getPages() {
    this.page = 1;
    this.pages = [];

    let index = 1,
      list = [];

    for (var item of this.items) {
      list.push(item);

      if (index == this.itemsPerPage) {
        this.pages.push(list);
        index = 0;
        list = [];
      }

      index++;
    }
  }

  async changePage() {
    let messageData: MessageEditOptions = this.events!.changePage(
      this,
      this.pageItems
    );

    if (!this.message)
      this.message = await this.interaction.editReply(messageData);
    else await this.message.edit(messageData);
  }

  async selectOption(values: string[]) {
    this.option = Number(values[0].split("-")[0]);

    if (isNaN(this.option)) return this.backToPages();

    let messageData: MessageEditOptions = this.events!.selectOption(
      this,
      values
    );

    if (!this.message)
      this.message = await this.interaction.editReply(messageData);
    else await this.message.edit(messageData);
  }

  backToPages() {
    this.changePage();
  }

  toFirstPage() {
    this.page = 1;

    this.events!.toFirstPage(this);
    this.changePage();
  }

  toBackPage() {
    if (this.page) this.page--;

    this.events!.toBackPage(this);
    this.changePage();
  }

  toNextPage() {
    if (this.page < this.pages.length) this.page++;

    this.events!.toNextPage(this);
    this.changePage();
  }

  toLastPage() {
    this.page = this.pages.length;

    this.events!.toLastPage(this);
    this.changePage();
  }
}
