import { readdirSync } from "fs";
import path from "path";

export interface ModelsOptionsProps {
  [key: string]: {
    name: string;
    types: (string | number)[];
    default: Function;
    checkCallback: Function;
  };
}

export interface ModelsProps {
  [key: string]: {
    schema: any;
    model: any;
  };
}

export default class Manager {
  models: ModelsProps;

  modelsOptions: ModelsOptionsProps;

  constructor() {
    this.models = {};

    this.modelsOptions = {};
  }

  async loadModels() {
    var modelsDirectory = path.join(__dirname, "models");
    for (var modelFileName of readdirSync(modelsDirectory)) {
      var modelName = modelFileName.split(".")[0];

      const modelModule = await import(
        path.join(modelsDirectory, modelFileName)
      );

      this.models[modelName] = {
        schema: modelModule.schema,
        model: modelModule.default,
      };

      var modelOption = modelModule.modelOption;

      this.modelsOptions[modelOption.name] = modelOption;

      for (var type of modelModule.modelOption.types)
        this.modelsOptions[type.toString()] = modelOption;
    }
  }
}
