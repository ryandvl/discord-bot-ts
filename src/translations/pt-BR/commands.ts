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
        options: {
          command_name: {
            name: "nome_do_comando",
            description: "Nome do comando para reiniciar",
          },
        },
      },
      file: {
        name: "caminho_do_arquivo",
        description: "Arquivo para reiniciar",
        options: {
          file_name: {
            name: "nome_do_arquivo",
            description: "Caminho do arquivo para reiniciar",
          },
        },
      },
    },

    command: {
      invalid: "❌ %bar Este **comando** é inválido.",
      error: "❌ %bar Um **erro** foi ocorrido.",
      reloaded: "✅ %bar **Comando** reiniciado.",
    },

    file: {
      invalid: "❌ %bar Este **caminho de arquivo** é inválido.",
      error: "❌ %bar Um **erro** foi ocorrido.",
      reloaded: "✅ %bar **Arquivo** reiniciado.",
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
