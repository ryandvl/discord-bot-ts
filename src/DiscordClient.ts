//#region Necessary Packages
import {
  ApplicationCommandDataResolvable,
  Client,
  ClientOptions,
  Collection,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { readdirSync } from "fs";
import path from "path";
//#endregion

//#region Files Modules
import { writeEventLine } from "./ConsoleColorful";
import config from "../config";
import CommandStructure, {
  OptionsProps,
  optionsFunctions,
} from "./controller/Command";
import EventStructure from "./controller/Event";
import Translation from "./controller/Translation";
import DatabaseUtils from "./utils/Database";
//#endregion

/**
 * Default Bot Handler
 * @extends Client
 */
export default class DiscordClient extends Client {
  _optionsClient: ClientOptions;

  events: string[];

  commands: ApplicationCommandDataResolvable[];
  slashCommands: Collection<string, CommandStructure>;

  translation: Translation;

  database: DatabaseUtils;

  startTime: number;

  constructor(options: ClientOptions) {
    super(options);
    this._optionsClient = options;

    this.events = new Array<string>();

    this.commands = new Array<ApplicationCommandDataResolvable>();
    this.slashCommands = new Collection<string, CommandStructure>();

    this.translation = new Translation(this);

    this.database = new DatabaseUtils();

    this.startTime = Date.now();
  }

  /**
   * Verify all command files and load them
   * @async
   * @returns {Promise<boolean>}
   */
  async loadCommands(): Promise<boolean> {
    var commandsDirectory: string = path.join(
      __dirname,
      config.loaders?.commandsDir ?? "commands"
    );

    for (var categoryName of readdirSync(commandsDirectory)) {
      var categoryDirectory: string = path.join(
        commandsDirectory,
        categoryName
      );

      for (var commandFileName of readdirSync(categoryDirectory)) {
        var commandDirectory: string = path.join(
            categoryDirectory,
            commandFileName
          ),
          commandModule = await import(commandDirectory),
          command: CommandStructure = new commandModule.default(this),
          commandName = commandFileName.split(".")[0];

        command.data.setName(commandName);

        const findOptions = (
          options: OptionsProps[] = [],
          dataOptions: SlashCommandSubcommandBuilder | SlashCommandBuilder,
          lastTranslationPath: string[] = []
        ) => {
          for (var option of options) {
            var functiona = optionsFunctions[option.type](dataOptions);
            var subCommandGroup = dataOptions.addStringOption(
              (_: SlashCommandStringOption) =>
                _.setName("ata").setDescription("test").setRequired(true)
            );

            this.translation.setCommandOptionsTranslations(
              command,
              option,
              subCommandGroup,
              option.type == "sub_command_group"
                ? [...lastTranslationPath, "options", option.name]
                : []
            );

            // if (option.type == "sub_command_group") {
            //   for (var groupOption of option.options ?? []) {
            //     var subCommand: SlashCommandSubcommandBuilder =
            //         subCommandGroup.addSubcommand(
            //           (_: SlashCommandSubcommandBuilder) => _
            //         ),
            //       translatePath = [
            //         ...lastTranslationPath,
            //         "options",
            //         option.name,
            //         "options",
            //         groupOption.name,
            //       ];

            //     this.translation.setCommandOptionsTranslations(
            //       command,
            //       groupOption,
            //       subCommand,
            //       translatePath
            //     );

            //     findOptions(groupOption.options, subCommand, translatePath);
            //   }
            // }
          }
        };

        findOptions(command.options, command.data);

        this.translation.setCommandTranslations(command, categoryName);

        this.commands.push(command.data);
        this.slashCommands.set(commandName, command);
      }
    }

    writeEventLine(
      `&aLoaded &c${this.commands.length} &acommands in Application&f.`,
      "client",
      "commands"
    );

    return true;
  }

  /**
   * Sync all Slash Commands with Discord
   * @async
   * @returns {Promise<boolean>}
   */
  async registrySlashCommands(): Promise<boolean> {
    writeEventLine(
      `&eSyncing &c${this.commands.length} &ecommands with &c${this.guilds.cache.size} &eguilds&f.`,
      "client",
      "commands"
    );

    await this.application?.commands.set(this.commands);

    writeEventLine(`&aSynced all commands&f.`, "client", "commands");

    return true;
  }

  /**
   * Load all Discord Events in the Bot
   * @async
   * @returns {Promise<boolean>}
   */
  async loadEvents(): Promise<boolean> {
    var eventsDirectory: string = path.join(
      __dirname,
      config.loaders?.eventsDir ?? "events"
    );

    for (var eventFileName of readdirSync(eventsDirectory)) {
      var eventDirectory: string = path.join(eventsDirectory, eventFileName),
        eventModule = await import(eventDirectory),
        eventClass: EventStructure = new eventModule.default(this),
        eventName: string = eventFileName.split(".")[0];

      this.on(eventName, eventClass.run);
      this.events.push(eventName);
    }

    writeEventLine(
      `&aLoaded &c${this.events.length} &aevents in Application&f.`,
      "client",
      "events"
    );

    return true;
  }

  /**
   * Start all necessary functions to initialize the Bot
   * @returns {Promise<boolean>}
   */
  async start(): Promise<boolean> {
    await this.translation.getLocales();
    await this.login(process.env.TOKEN);
    await this.loadEvents();
    await this.loadCommands();

    return true;
  }
}
