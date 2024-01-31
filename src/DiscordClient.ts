//#region Necessary Packages
import {
  ApplicationCommandDataResolvable,
  Client,
  ClientOptions,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { readdirSync } from "fs";
import path from "path";
//#endregion

//#region Files Modules
import { writeEventLine } from "./ConsoleColorful";
import config from "../config";
import CommandStructure, {
  OptionsProps,
  optionsType,
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
        this.translation.setCommandTranslations(command, categoryName);

        const handleOptions = async (
          options: OptionsProps["options"] = [],
          translationPath: string[] = []
        ) => {
          let newOptions: any[] = [];

          for (var option of options) {
            var optionType = option.type.toLowerCase();

            let newOption: any = {};

            newOption.type = optionsType[optionType];

            if (optionType == "channel")
              newOption.channel_types = option.channel_types ?? [];

            if (["string", "integer", "number"].includes(optionType))
              newOption.autocomplete = option.autocomplete ?? false;

            if (["integer", "number"].includes(optionType)) {
              newOption.min_value = option.min_value ?? 1;
              newOption.max_value = option.max_value ?? 1000000;
            }

            if (optionType == "string") {
              newOption.min_length = option.min_length ?? 0;
              newOption.max_length = option.max_length ?? 6000;
            }

            newOption = {
              ...this.translation.setCommandOptionsTranslations(
                commandName,
                option,
                translationPath
              ),
              ...newOption,
            };

            if (["sub_command_group", "sub_command"].includes(optionType)) {
              newOption.options = await handleOptions(option.options, [
                ...translationPath,
                "options",
                option.name,
              ]);
            } else {
              newOption.required = option.required ?? false;
            }

            newOptions.push(newOption);
          }

          return newOptions;
        };

        command._data = {
          ...command.data.toJSON(),
          options: await handleOptions(command.options),
        };
        command.path = commandDirectory;

        this.commands.push(command._data);
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
    const rest = new REST({ version: "10" }).setToken(
      process.env.TOKEN as string
    );

    writeEventLine(
      `&eSyncing &c${this.commands.length} &ecommands with &c${this.guilds.cache.size} &eguilds&f.`,
      "client",
      "commands"
    );

    try {
      await rest.put(Routes.applicationCommands(this.user!.id), {
        body: this.commands,
      });
    } catch (er) {
      console.log("Error: ", er);
    }

    writeEventLine(`&aSynced all commands&f.`, "client", "commands");

    return true;
  }

  async reloadCommand(commandName: string): Promise<boolean> {
    var command = this.slashCommands.get(commandName);

    if (!command?.path) return false;

    this.commands = [];
    this.slashCommands.clear();

    delete require.cache[require.resolve(command.path)];

    await this.loadCommands();
    await this.registrySlashCommands();

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
