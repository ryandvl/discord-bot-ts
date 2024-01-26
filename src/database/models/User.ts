import { Schema, model } from "mongoose";
import { content } from "../../utils/Database";
import { ModelsOptionsProps } from "../Manager";
import { basename } from "path";

export const modelOption: ModelsOptionsProps[0] = {
  name: basename(__filename).split(".")[0],
  types: [1, "users"],
  default: (content: content) => ({
    _id: content.id,
  }),
  checkCallback: function (content: content): boolean {
    if (content.bot) return false;
    return true;
  },
};

export const schema = new Schema({
  _id: { type: String, require: true },
  language: { type: String, default: "pt-BR" },
});

export default model(modelOption.name, schema);
