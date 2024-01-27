import { LocaleString } from "discord.js";
import { readdirSync } from "fs";
import path from "path";

import CommandStructure from "./Command";
import { writeEventLine } from "../ConsoleColorful";
import DiscordClient from "../DiscordClient";

export const GUILD_EMOJIS = ["1198537913999302758"];
export const SEPARATORS = {
  bar: " **|** ",
  double_arrow: " **»** ",
  arrow: " **›** ",
  ball: " **•** ",
};

export interface TranslationsProps {
  [key: string]: {
    [key: string]: any;
  };
}

export default class Translation {
  client: DiscordClient;

  locales: LocaleString[];
  types: string[];

  translations: TranslationsProps;

  emojis: any;

  constructor(client: DiscordClient) {
    this.client = client;

    this.locales = [];
    this.types = [];

    this.translations = {};

    this.emojis = {};
  }

  getEmojis() {
    for (var guildId of GUILD_EMOJIS) {
      let guild = this.client.guilds.cache.get(guildId);

      if (!guild) continue;

      guild.emojis.cache.forEach((emoji) => {
        this.emojis[emoji.name ?? "invalid"] = emoji.toString();
      });
    }
  }

  setCommandTranslations(command: CommandStructure) {
    for (var locale of this.locales) {
      command.data.setNameLocalization(
        locale,
        this.translations[locale]?.commands?.[command.data.name]?.name ??
          command.data.name
      );

      command.data.setDescriptionLocalization(
        locale,
        this.translations[locale]?.commands?.[command.data.name]?.description ??
          "Invalid Locale Description, Please contact the Bot Developer."
      );
    }
  }

  /**
   * Get all locales used in Bot
   * @async
   */
  async getLocales() {
    var translationsDirectory = path.join(__dirname, "..", "translations");
    var locales = readdirSync(translationsDirectory) as LocaleString[];

    this.locales = locales;

    for (var locale of locales) {
      this.translations[locale] = {};

      var localeDirectory = path.join(translationsDirectory, locale);
      var types = readdirSync(localeDirectory);

      let typesLoaded = 0;
      for (var type of types) {
        var typeDirectory = path.join(localeDirectory, type);
        var typeName = type.split(".")[0];

        this.types.push(typeName);

        this.translations[locale][typeName] = (
          await import(typeDirectory)
        ).default;
        typesLoaded++;
      }

      writeEventLine(
        `&aLoaded &c${typesLoaded} &atypes in &c${locale} &alanguage&f.`,
        "system",
        "translation"
      );
    }
  }
}
