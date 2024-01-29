import {
  LocaleString,
  SlashCommandAttachmentOption,
  SlashCommandMentionableOption,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { readdirSync } from "fs";
import path from "path";

import CommandStructure, { OptionsProps } from "./Command";
import { writeEventLine } from "../ConsoleColorful";
import DiscordClient from "../DiscordClient";
import config from "../../config";
import Translator from "./Translator";

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

  setCommandTranslations(command: CommandStructure, category: string) {
    command.data.setDescription(
      this.translations["en-US"]["commands"][command.data.name]?.description ??
        "Invalid Description, Please contact the Bot Developer."
    );

    for (var locale of this.locales) {
      var translation =
        this.translations[locale]?.["commands"]?.[command.data.name];

      //#region Command Name & Description
      command.data.setNameLocalization(
        locale,
        translation?.name ?? command.data.name
      );

      var commandDescription = new String() as string;
      if (config.commandDescription)
        commandDescription = Translator.setPlaceholder(
          config.commandDescription,
          {
            holders: ["{", "}"],
            places: {
              emoji:
                this.translations[locale]?.["categories"]?.["commands"]?.[
                  category
                ].emoji,
              description: translation?.description,
              category: category,
            },
          }
        );
      else commandDescription = translation?.description;

      command.data.setDescriptionLocalization(
        locale,
        translation?.description
          ? commandDescription
          : "Invalid Locale Description, Please contact the Bot Developer."
      );
      //#endregion
    }
  }

  setCommandOptionsTranslations(
    commandName: string,
    option: OptionsProps,
    optionBuilder: any,
    translatePath: string[]
  ) {
    optionBuilder.setName(option.name.toString());

    for (var locale of this.locales) {
      var translation = this.translations[locale]["commands"][commandName],
        enTranslation = this.translations["en-US"]["commands"][commandName];

      for (var pathString of translatePath) {
        translation = translation[pathString];
        enTranslation = enTranslation[pathString];
      }
      optionBuilder.setDescription(
        enTranslation.options[option.name].description ??
          "Invalid Description, Please contact the Bot Developer."
      );

      optionBuilder.setNameLocalization(
        locale,
        translation.options[option.name].name
      );

      optionBuilder.setDescriptionLocalization(
        locale,
        translation.options[option.name].description
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
