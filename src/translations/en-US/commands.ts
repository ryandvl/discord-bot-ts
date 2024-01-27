import { stringFormatter } from "../../utils/Text";

export default {
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
};
