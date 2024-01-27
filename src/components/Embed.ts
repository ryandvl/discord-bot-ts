import { ColorResolvable, EmbedBuilder } from "discord.js";
import config from "../../config";

export interface EmbedProps {
  title?: string;
  description?: string;
  color?: ColorResolvable | string;
  fields?: {
    name: string;
    value: string;
    inLine?: boolean;
  }[];
  author?: {
    name: string;
    iconURL?: string;
  };
  footer?: {
    text: string;
    iconURL?: string;
  };
  timestamp?: number;
  thumbnail?: string;
  image?: string;
}

const Embed = (options: EmbedProps): EmbedBuilder => {
  const embed = new EmbedBuilder();

  if ("color" in options && typeof options.color !== "undefined")
    if ((options.color as string) in (config.embedColors ?? {}))
      embed.setColor(
        config.embedColors?.[options.color as string] as ColorResolvable
      );
    else embed.setColor(options.color as ColorResolvable);

  if ("title" in options && typeof options.title !== "undefined")
    embed.setTitle(options.title);

  if ("description" in options && typeof options.description !== "undefined")
    embed.setDescription(options.description);

  if ("fields" in options)
    for (var field of options.fields ?? []) embed.addFields(field);

  if ("author" in options)
    embed.setAuthor({
      name: options.author?.name ?? "???",
      iconURL: options.author?.iconURL ?? undefined,
    });

  if ("footer" in options)
    embed.setFooter({
      text: options.footer?.text ?? "???",
      iconURL: options.footer?.iconURL ?? undefined,
    });

  if ("timestamp" in options) embed.setTimestamp(options.timestamp);

  if ("thumbnail" in options && typeof options.thumbnail !== "undefined")
    embed.setThumbnail(options.thumbnail);

  if ("image" in options && typeof options.image !== "undefined")
    embed.setImage(options.image);

  return embed;
};

export default Embed;
