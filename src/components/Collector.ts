import {
  AnySelectMenuInteraction,
  ChatInputCommandInteraction,
  CollectorFilter,
  ComponentType,
  Interaction,
  Message,
} from "discord.js";

type FunctionProps = (interaction: AnySelectMenuInteraction) => any;

export interface CollectorProps {
  interaction: ChatInputCommandInteraction;
  response: Message;
  filter?: Function;
  callbacks?: {
    collect?: FunctionProps;
    dispose?: FunctionProps;
    end?: Function;
    ignore?: Function;
  };
  time?: Number;
  component: {
    id?: string;
    type:
      | "button"
      | "stringSelect"
      | "userSelect"
      | "roleSelect"
      | "mentionableSelect"
      | "channelSelect";
  };
}

type TypesProps =
  | ComponentType.Button
  | ComponentType.StringSelect
  | ComponentType.UserSelect
  | ComponentType.RoleSelect
  | ComponentType.MentionableSelect
  | ComponentType.ChannelSelect;

export const types = {
  button: ComponentType.Button,
  stringSelect: ComponentType.StringSelect,
  userSelect: ComponentType.UserSelect,
  roleSelect: ComponentType.RoleSelect,
  mentionableSelect: ComponentType.MentionableSelect,
  channelSelect: ComponentType.ChannelSelect,
};

export default class Collector {
  response: CollectorProps["response"];
  interaction: CollectorProps["interaction"];

  component: CollectorProps["component"];
  filter?: CollectorProps["filter"];
  callbacks: CollectorProps["callbacks"];
  time?: CollectorProps["time"];

  collector: any;

  constructor(options: CollectorProps) {
    this.response = options.response;
    this.interaction = options.interaction;

    this.component = options.component;

    if (options.filter) this.filter = options.filter;
    else
      this.filter = (interaction: Interaction) =>
        interaction.user.id == this.interaction.user.id;

    this.callbacks = options.callbacks;

    if (options.time) this.time = options.time;

    this.collector = this.createCollector();
  }

  createCollector() {
    const collector = this.response.createMessageComponentCollector({
      componentType: types[this.component.type] as TypesProps,
      filter: this.filter as CollectorFilter<unknown[]>,
      time: (this.time ?? 60_000) as number,
    });

    collector.on("collect", (interaction) => {
      if (this.callbacks?.collect)
        this.callbacks.collect(interaction as AnySelectMenuInteraction);
    });

    collector.on("dispose", (interaction) => {
      if (this.callbacks?.dispose)
        this.callbacks.dispose(interaction as AnySelectMenuInteraction);
    });

    collector.on("end", (interaction) => {
      if (this.callbacks?.end) this.callbacks.end(interaction);
    });

    collector.on("ignore", (interaction) => {
      if (this.callbacks?.ignore) this.callbacks.ignore(interaction);
    });

    return collector;
  }
}
