import { Schema, model } from "mongoose";
import { basename } from "path";

import { content } from "../../controller/Database";
import { ModelsOptionsProps } from "../Manager";

export const modelOption: ModelsOptionsProps[0] = {
  name: basename(__filename).split(".")[0],

  types: [2, "guilds"],
  default: (content: content) => ({
    _id: content.id,
  }),
  checkCallback: function (content: content): boolean {
    if (!content.guild) return false;
    return true;
  },
};

export const schema = new Schema({
  _id: { type: String, require: true },
});

export default model(modelOption.name, schema);
