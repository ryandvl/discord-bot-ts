import { stringFormatter } from "../../utils/Text";

export default {
  ping: {
    name: "latência",
    description: "Confira a minha latência para verificar se estou instável!",

    content: "%bar Veja a minha latência abaixo:",
    embed: {
      title: "🖥️ %double_arrow Latência do Bot",
      description: stringFormatter(
        "📖 API %arrow **{api}**ms;",
        "📩 Banco de Dados %arrow **{database}**ms;",
        "",
        "⏱️ %arrow Tempo Online: <t:{time_online}:R>"
      ),
    },
  },
};
