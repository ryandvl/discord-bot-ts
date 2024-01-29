import { stringFormatter } from "../../utils/Text";

export default {
  //#region developer
  eval: {
    name: "eval",
    description: "Developer Command",

    modal: {
      title: "Eval Command",
      code: {
        label: "🖥️ Code to execute:",
        placeholder: "Enter the code here",
      },
    },

    embed: {
      description: "more",
      title: "🔎 %arrow Result type: `{resultType}`",
    },
  },

  reload: {
    name: "reload",
    description: "Developer Command",

    options: {
      command: {
        name: "command",
        description: "Command to reload",
        options: {
          command_name: {
            name: "command_name",
            description: "Name of command to reload",
          },
        },
      },
      file: {
        name: "file",
        description: "File to reload",
        options: {
          file_name: {
            name: "file_name",
            description: "Path of file to reload",
          },
        },
      },
    },
  },
  //#endregion

  //#region utility
  ping: {
    name: "ping",
    description: "Check my latency to see if i'm unstable!",

    content: "%bar Check my latency below:",
    embed: {
      title: "🖥️ %double_arrow Bot Latency",
      description: stringFormatter(
        "📖 API %arrow **{api}**ms;",
        "📩 Database %arrow **{database}**ms;",
        "",
        "⏱️ %arrow Time Online: <t:{time_online}:R>"
      ),
    },
  },
  //#endregion
};
