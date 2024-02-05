import DiscordClient from "../DiscordClient";

export interface EventConstructorProps {
  run(this: DiscordClient, ...param: any): Promise<any>;
}

export default class Event {
  run: EventConstructorProps["run"];

  constructor(options: EventConstructorProps) {
    this.run = options.run;
  }
}
