import DiscordClient from "../../DiscordClient";
import Pager from "../../components/Pager";
import CommandStructure, { CommandProps } from "../../controller/Command";

export default class Command extends CommandStructure {
  constructor(client: DiscordClient) {
    super(client);

    this.requirements = {
      botDeveloper: true,
    };
  }

  run = async ({ interaction, t }: CommandProps["run"]) => {
    let numbers = [];

    for (let i = 1; i <= 100; i++) numbers.push(i.toString());

    new Pager({
      client: this.client,
      interaction,
      translate: t,
      items: numbers,
    });
  };
}
