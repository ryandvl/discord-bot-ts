import { Schema, model } from "mongoose";
import { basename } from "path";

import { content } from "../../controller/Database";
import { ModelsOptionsProps } from "../Manager";

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
  admin: { type: Boolean, default: false },
  economy: {
    coins: { type: Number, default: 0 },
  },
  premium: {
    active: { type: Boolean, default: false },
    at: { type: Number, default: 0 },
  },
});

export default model(modelOption.name, schema);
