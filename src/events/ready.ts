import { writeEventLine } from "../ConsoleColorful";
import EventStructure from "../controller/Event";

export default class Event extends EventStructure {
  run = async () => {
    this.client.translation.getEmojis();

    await this.client.registrySlashCommands();

    writeEventLine(
      `&aLogged in &c${this.client.user?.tag}&f.`,
      "events",
      "ready"
    );
  };
}
