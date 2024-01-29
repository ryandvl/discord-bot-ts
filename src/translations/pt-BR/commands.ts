import { stringFormatter } from "../../utils/Text";

export default {
  //#region developer
  eval: {
    name: "eval",
    description: "Comando de Desenvolvedor",

    modal: {
      title: "Comando Eval",
      code: {
        label: "🖥️ Código para executar:",
        placeholder: "Coloque o código aqui",
      },
    },

    embed: {
      description: "mais",
      title: "🔎 %arrow Tipo de Retorno: `{resultType}`",
    },
  },

  reload: {
    name: "reiniciar",
    description: "Comando de Desenvolvedor",

    options: {
      command: {
        name: "comando",
        description: "Comando para reiniciar",
      },
    },
  },
  //#endregion

  //#region utility
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
  //#endregion
};
