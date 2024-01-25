import { writeEventLine } from "../ConsoleColorful";
import EventStructure from "../controller/Event";

export default class Event extends EventStructure {
  run = () => {
    writeEventLine(
      `&aLogged in &c${this.client.user?.tag}&f.`,
      "events",
      "ready"
    );
  };
}
