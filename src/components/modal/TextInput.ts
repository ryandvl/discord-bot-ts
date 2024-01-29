import { TextInputBuilder, TextInputStyle } from "discord.js";

export interface TextInputStyleProps {
  [key: string]: number;
}

export interface TextInputProps {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  style?: string;
}

const textInputStyles: TextInputStyleProps = {
  short: 1,
  paragraph: 2,
};

const TextInput = (options: TextInputProps): TextInputBuilder => {
  const textInput = new TextInputBuilder();

  if ("id" in options) textInput.setCustomId(options.id);

  if ("label" in options) textInput.setLabel(options.label);

  if ("placeholder" in options) textInput.setPlaceholder(options.placeholder);

  if (options.value) textInput.setValue(options.value);

  textInput.setMinLength(options.minLength ?? 1);

  textInput.setMaxLength(options.maxLength ?? 4000);

  textInput.setRequired(options.required ?? true);

  textInput.setStyle(textInputStyles[options.style ?? "short"]);

  return textInput;
};

export default TextInput;
