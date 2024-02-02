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

  inspect: {
    name: "inspect",
    description: "Developer Command",

    options: {
      guild: {
        name: "guild",
        description: "Inspect Guild database",
        options: {
          id: {
            name: "id",
            description: "GuildID to inspect",
          },
        },
      },
      user: {
        name: "user",
        description: "Inspect User database",
        options: {
          id: {
            name: "id",
            description: "UserID to inspect",
          },
        },
      },
    },

    no_exists: "❌ %bar This **id** no exists.",
    embed: {
      title: "🔎 %arrow Inspecting;",
      description: "**{key}**: {info} %bar `{type}`",
      footer: "Path: {path}",
    },
    modal: {
      title: "Inspect Command",
      value: {
        label: "📩 Value to change:",
        placeholder: "Enter the value here",
      },
      success: "✅ %bar Loading, please wait...",
    },
    components: {
      back: "Back",
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

    command: {
      invalid: "❌ %bar This **command** is invalid.",
      error: "❌ %bar An **error** has ocurred.",
      reloaded: "✅ %bar **Command** reloaded.",
    },

    file: {
      invalid: "❌ %bar This **file path** is invalid.",
      error: "❌ %bar An **error** has ocurred.",
      reloaded: "✅ %bar **File** realoaded.",
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
