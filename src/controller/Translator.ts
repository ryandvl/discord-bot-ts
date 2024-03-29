import { Interaction, LocaleString } from "discord.js";
import DiscordClient from "../DiscordClient";
import Translation, { SEPARATORS } from "./Translation";

interface PlaceholderOptionsProps {
  holders: string[];
  places: any;
}

export default class Translator {
  client: DiscordClient;
  interaction: Interaction;

  translation: Translation;

  locale: LocaleString;

  constructor(
    client: DiscordClient,
    interaction: Interaction,
    locale: LocaleString
  ) {
    this.client = client;
    this.interaction = interaction;

    this.translation = client.translation;

    this.locale = locale ?? "en-US";
  }

  translate = (string: string, replaceParams: any = {}) => {
    const errorMessage = "%error%";

    var typeSplit = string.split(":");
    if (!this.translation.types.includes(typeSplit[0])) return errorMessage;

    var paramsSplit = typeSplit[1].split(".");

    let file = this.translation.translations[this.locale][typeSplit[0]];
    for (var stringPath of paramsSplit) file = file[stringPath] ?? {};

    if (typeof file !== "string") return errorMessage;

    let translation: string = file as unknown as string;

    translation = this.setPlaceholders(translation, replaceParams);

    return translation;
  };

  setPlaceholders(string: string, replaceParams: any = {}) {
    let translation: string = string;

    translation = Translator.setPlaceholder(translation, {
      holders: ["%", "%"],
      places: this.translation.emojis,
    });

    translation = Translator.setPlaceholder(translation, {
      holders: ["%", ""],
      places: SEPARATORS,
    });

    translation = Translator.setPlaceholder(translation, {
      holders: ["{", "}"],
      places: {
        ...replaceParams,
        author: this.interaction.user.toString(),
        author_username: this.interaction.user.username,
        author_tag: this.interaction.user.tag,
        author_id: this.interaction.user.id,
        guild: this.interaction?.guild?.name,
        guild_id: this.interaction?.guild?.id,
      },
    });

    return translation;
  }

  static setPlaceholder(content: string, options: PlaceholderOptionsProps) {
    var hold = options.holders,
      regExp = new RegExp(`${hold[0]}\\w+${hold[1]}`, "g");

    return content.replace(regExp, (word) => {
      word = word.slice(hold[0].length, word.length - hold[1].length);
      return options.places[word] ?? hold[0] + "error" + hold[1];
    });
  }
}
