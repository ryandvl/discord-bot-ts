import { ConfigProps } from "./config-props";
import { secondsToMs } from "./src/utils/Date";

const config: ConfigProps = {
  botDevelopers: ["878683493759090718"],
  commandDescription: "[{emoji}] {description}",
  embedColors: {
    default: "#ac4dff",
    invisible: "#2B2D31",
  },

  activities: {
    list: (client) => {
      var botDeveloper = config.botDevelopers?.length
        ? client.users.cache.get(config.botDevelopers?.[0])?.globalName
        : null;

      return [
        {
          name: "hello",
          state: "👋 Hello World!",
          type: "custom",
        },
        {
          name: "developer",
          state: `🧑‍💻 Developed by: ${botDeveloper ?? "???"}`,
          type: "custom",
        },
      ];
    },

    changeTime: secondsToMs(30),
  },
};

export default config;
