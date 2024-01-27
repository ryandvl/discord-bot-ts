import {
  CollectorFilter,
  ComponentType,
  Interaction,
  InteractionResponse,
} from "discord.js";

export interface CollectorProps {
  response: InteractionResponse;
  filter?: Function;
  callbacks?: {
    collect?: Function;
    dispose?: Function;
    end?: Function;
    ignore?: Function;
  };
  component: {
    id: string;
    type:
      | ComponentType.Button
      | ComponentType.StringSelect
      | ComponentType.UserSelect
      | ComponentType.RoleSelect
      | ComponentType.MentionableSelect
      | ComponentType.ChannelSelect
      | undefined;
  };
}

export default class Collector {
  response: CollectorProps["response"];

  component: CollectorProps["component"];
  filter?: CollectorProps["filter"];
  callbacks: CollectorProps["callbacks"];

  collector: any;

  constructor(options: CollectorProps) {
    this.response = options.response;

    this.component = options.component;

    if (options.filter) this.filter = options.filter;
    else
      this.filter = (interaction: Interaction) =>
        interaction.user.id == this.response.interaction.user.id;

    this.callbacks = options.callbacks;

    this.collector = this.createCollector();
  }

  createCollector() {
    const collector = this.response.createMessageComponentCollector({
      componentType: this.component.type,
      filter: this.filter as CollectorFilter<unknown[]>,
    });

    collector.on("collect", (interaction) => {
      if (this.callbacks?.collect && this.component.id == interaction.customId)
        this.callbacks.collect(interaction);
    });

    collector.on("dispose", (interaction) => {
      if (this.callbacks?.dispose && this.component.id == interaction.customId)
        this.callbacks.dispose(interaction);
    });

    collector.on("end", (interaction) => {
      if (this.callbacks?.end) this.callbacks.end(interaction);
    });

    collector.on("ignore", (interaction) => {
      if (this.callbacks?.ignore && this.component.id == interaction.customId)
        this.callbacks.ignore(interaction);
    });

    return collector;
  }
}
