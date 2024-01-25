import DiscordClient from "../DiscordClient";

export interface AnyEventProps {
  [key: string]: any;
}

export default class EventStructure {
  client: DiscordClient;
  constructor(client: DiscordClient) {
    this.client = client;
  }

  run(param1: AnyEventProps, param2: AnyEventProps, param3: AnyEventProps) {}
}
