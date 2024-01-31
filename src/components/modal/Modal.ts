import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "discord.js";
import { ModalBuilders } from "./ModalRow";

export interface ModalProps {
  id: string;
  title: string;
  components: Array<ActionRowBuilder<ModalBuilders>>;
}

const Modal = (options: ModalProps) => {
  const modal = new ModalBuilder();

  if ("id" in options) modal.setCustomId(options.id);

  if ("title" in options) modal.setTitle(options.title);

  modal.setComponents(
    options.components as Array<ActionRowBuilder<TextInputBuilder>>
  );

  return modal;
};

export default Modal;
