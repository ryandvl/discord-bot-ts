import { TextInputBuilder, TextInputStyle } from "discord.js";

export interface TextInputStyleProps {
  [key: string]: number;
}

export interface TextInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  minLength: number;
  maxLength: number;
  required: boolean;
  style: string;
}

const textInputStyles: TextInputStyleProps = {
  short: 1,
  paragraph: 2,
};

const TextInput = (options: TextInputProps) => {
  const textInput = new TextInputBuilder();

  if ("id" in options) textInput.setCustomId(options.id);

  if ("label" in options) textInput.setLabel(options.label);

  if ("placeholder" in options) textInput.setPlaceholder(options.placeholder);

  if ("value" in options) textInput.setValue(options.value);

  if ("minLength" in options) textInput.setMinLength(options.minLength);

  if ("maxLength" in options) textInput.setMaxLength(options.maxLength);

  if ("required" in options) textInput.setRequired(options.required);

  if ("style" in options)
    textInput.setStyle(textInputStyles[options.style] ?? TextInputStyle.Short);

  return textInput;
};

export default TextInput;
