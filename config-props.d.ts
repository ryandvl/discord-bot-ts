import { ActivityOptions, PresenceStatusData } from "discord.js";

import DiscordClient from "./src/DiscordClient";

type ActivityType =
  | "playing"
  | "streaming"
  | "listening"
  | "watching"
  | "custom"
  | "competing";

export interface ConfigProps {
  botDevelopers?: string[] | [];
  embedColors?: {
    [key: string]: string;
  };
  commandDescription?: string | null;
  supportServer?: string | null;
  loaders?: {
    commandsDir?: string | "commands";
    eventsDir?: string | "events";
  };

  status?: PresenceStatusData;
  activities?: {
    list: (client: DiscordClient) => {
      name: string;
      type: ActivityType;
      state?: string;
      url?: string;
      shardId?: number | readonly number[];
    }[];
    changeTime: number;
  };
}
