import {
  ApplicationCommandDataResolvable,
  Client,
  ClientOptions,
  Collection,
} from "discord.js";
import { readdirSync } from "fs";
import config from "../config";
import CommandStructure from "./controller/Command";
import { writeEventLine } from "./ConsoleColorful";
import path from "path";
import EventStructure from "./controller/Event";

export default class DiscordClient extends Client {
  _optionsClient: ClientOptions;
  events: string[];
  commands: ApplicationCommandDataResolvable[];
  slashCommands: Collection<string, CommandStructure>;
  startTime: number;
  constructor(options: ClientOptions) {
    super(options);
    this._optionsClient = options;

    this.events = new Array<string>();
    this.commands = new Array<ApplicationCommandDataResolvable>();

    this.slashCommands = new Collection<string, CommandStructure>();

    this.startTime = Date.now();
  }

  async loadCommands() {
    var commandsDirectory = path.join(
      __dirname,
      ".",
      config.loaders?.commandsDir ?? "commands"
    );

    for (var categoryName of readdirSync(commandsDirectory)) {
      var categoryDirectory = path.join(commandsDirectory, ".", categoryName);

      for (var commandName of readdirSync(categoryDirectory)) {
        var commandDirectory = path.join(categoryDirectory, ".", commandName);
        var commandModule = await import(commandDirectory);
        var command: CommandStructure = new commandModule.default(this);

        command.data.setName(commandName.split(".")[0]);
        command.data.setDescription("invalid");

        this.commands.push(command.data);
        this.slashCommands.set(command.data.name, command);
      }
    }

    writeEventLine(
      `&aLoaded &e${this.commands.length} &acommands in Application&f.`,
      "bot",
      "commands"
    );
    await this.registrySlashCommands();
  }

  async registrySlashCommands() {
    writeEventLine(
      `&eSyncing &c${this.commands.length} &ecommands with &c${this.guilds.cache.size} &eguilds&f.`,
      "bot",
      "commands"
    );

    await this.application?.commands.set(this.commands);

    writeEventLine(`&aSynced all commands&f.`, "bot", "commands");
  }

  async loadEvents() {
    var eventsDirectory = path.join(
      __dirname,
      ".",
      config.loaders?.eventsDir ?? "events"
    );

    for (var eventFileName of readdirSync(eventsDirectory)) {
      var eventDirectory = path.join(eventsDirectory, ".", eventFileName);
      var eventModule = await import(eventDirectory);
      var eventClass: EventStructure = new eventModule.default(this);

      var eventName = eventFileName.split(".")[0];

      this.on(eventName, eventClass.run);
      this.events.push(eventName);
    }

    writeEventLine(
      `&aLoaded &e${this.events.length} &aevents in Application&f.`,
      "bot",
      "events"
    );
  }

  async start() {
    await this.login(process.env.TOKEN);
    await this.loadEvents();
    await this.loadCommands();
  }
}
