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
import { writeEventLine } from "./utils/ConsoleColorful";
import config from "../config";
import Command from "./controller/Command";
import Event from "./controller/Event";
import { Translation, Database } from "./controller";
import {
  CommandOptionTypeNames,
  CommandOptionsProps,
  OPTIONS_TYPES,
} from "./types/command";
//#endregion

/**
 * Default Bot Handler
 * @extends Client
 */
export default class DiscordClient extends Client {
  _optionsClient: ClientOptions;

  events: string[] = new Array<string>();

  commands: ApplicationCommandDataResolvable[] =
    new Array<ApplicationCommandDataResolvable>();
  slashCommands: Collection<string, Command> = new Collection<
    string,
    Command
  >();
  messageCommands: Collection<string, Command> = new Collection<
    string,
    Command
  >();
  userCommands: Collection<string, Command> = new Collection<string, Command>();

  translation: Translation = new Translation(this);

  database: Database = new Database();

  startTime: number = Date.now();

  constructor(options: ClientOptions) {
    super(options);
    this._optionsClient = options;
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
          command: Command = commandModule.default,
          commandName = commandFileName.split(".")[0];

        if (command.type == "chatInput") {
          command.data.setName(commandName);
          this.translation.setCommandTranslations(
            "chatInput",
            command,
            commandName,
            categoryName
          );

          const handleOptions = async (
            options: CommandOptionsProps["options"] = [],
            translationPath: string[] = []
          ) => {
            let newOptions: any[] = [];

            for (var option of options) {
              var optionType =
                option.type.toLowerCase() as CommandOptionTypeNames;

              let newOption: any = {};

              newOption.type = OPTIONS_TYPES[optionType];

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
        } else {
          this.translation.setCommandTranslations(
            "contextMenu",
            command,
            commandName,
            categoryName
          );

          command._data = command.data.toJSON();
        }

        command.path = commandDirectory;
        command.category = categoryName;
        command.client = this;

        this.commands.push(command._data);

        switch (command.type) {
          case "chatInput":
            this.slashCommands.set(commandName, command);
            break;

          case "message":
            this.messageCommands.set(command.data.name, command);
            break;

          case "user":
            this.userCommands.set(command.data.name, command);
            break;
        }
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
      process.env.BOT_TOKEN as string
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

  /**
   * Get command with name
   * @returns {Command | false}
   */
  getCommand(commandName: string): Command | false {
    var command =
      this.slashCommands.get(commandName) ??
      this.userCommands.get(commandName) ??
      this.messageCommands.get(commandName);

    if (!command) return false;

    return command;
  }

  /**
   * Reload command function to "/reload command"
   * @async
   * @returns {Promise<boolean>}
   */
  async reloadCommand(commandName: string): Promise<boolean> {
    var command = this.getCommand(commandName);

    if (!command) return false;

    this.commands = [];
    this.slashCommands.clear();
    this.messageCommands.clear();
    this.userCommands.clear();

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
        eventClass: Event = eventModule.default,
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
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    await this.translation.getLocales();
    await this.login(process.env.BOT_TOKEN);
    await this.loadEvents();
    await this.loadCommands();
  }
}
