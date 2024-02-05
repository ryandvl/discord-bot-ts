import { connect } from "mongoose";
import Manager, { ModelsOptionsProps, ModelsProps } from "../database/Manager";
import { Guild, User } from "discord.js";

import { writeEventLine } from "../utils/ConsoleColorful";

export type type = string | number;
export type content = User | Guild | any;

export default class Database {
  database: any | null;

  manager: Manager;
  models: ModelsProps;
  modelsOptions: ModelsOptionsProps;

  startTime: number;

  constructor() {
    this.database = null;

    this.manager = new Manager();
    this.manager.loadModels();
    this.models = this.manager.models;
    this.modelsOptions = this.manager.modelsOptions;

    this.connect();

    this.startTime = Date.now();
  }

  async connect() {
    this.database = await connect(`${process.env.MONGO_URL}`)
      .then(() =>
        writeEventLine(
          "&aConnected with &cBot Database&a, ready for use&f.",
          "database",
          "connection"
        )
      )
      .catch((error) => {
        writeEventLine(
          "&b0&cUnable to connect with Bot Database&f.",
          "database",
          "connection"
        );

        console.error(error);
      });
  }

  async getPing(id: string) {
    let startTime = Date.now();

    await this.get(1, id);

    return Date.now() - startTime;
  }

  private getModelOption(type: type) {
    var databaseType = typeof type == "string" ? type.toLowerCase() : type;

    var modelOption = this.modelsOptions[databaseType.toString()];

    if (!modelOption) return null;

    return modelOption;
  }

  async get(type: type, content: content) {
    if (!this.database) return null;

    var modelOption = this.getModelOption(type);

    if (!modelOption || !modelOption.checkCallback(content)) return null;

    const databaseCheck = await this.models[modelOption.name].model.findOne({
      _id: modelOption.default(content)._id,
    });

    if (databaseCheck) return databaseCheck;
    return null;
  }

  async getOrCreate(type: type, content: content) {
    var data = await this.get(type, content);

    if (data) return data;

    var modelOption = this.getModelOption(type);

    if (!modelOption || !modelOption.checkCallback(content)) return null;

    const newData = new this.models[modelOption.name].model(
      modelOption.default(content)
    );

    await newData.save();

    return newData;
  }

  async exists(type: type, id: string | number) {
    var modelOption = this.getModelOption(type);

    if (!modelOption) return false;

    const data = this.models[modelOption.name].model;

    const result = await data.exists({ _id: id });

    return result !== null;
  }

  async delete(type: type, id: string | number) {
    if (!this.exists(type, id)) return;

    var modelOption = this.getModelOption(type);

    if (!modelOption) return false;

    const newData = this.models[modelOption.name].model;

    return await newData.deleteOne({ _id: id });
  }
}
