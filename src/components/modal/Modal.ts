import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
} from "discord.js";

export interface ModalProps {
  id: string;
  title: string;
  components: Array<ActionRowBuilder<ModalActionRowComponentBuilder>>;
}

const Modal = (options: ModalProps) => {
  const modal = new ModalBuilder();

  if ("id" in options) modal.setCustomId(options.id);

  if ("title" in options) modal.setTitle(options.title);

  modal.setComponents(options.components);

  return modal;
};

export default Modal;
