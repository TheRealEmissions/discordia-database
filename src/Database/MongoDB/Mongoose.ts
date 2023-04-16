import BaseApp from "../../BaseApp.js";
import { Schema } from "../../Types/SchemaType.js";
import { IDatabase } from "../IDatabase.js";
import MongoDB from "mongoose";
import { ModelBuilder } from "./ModelBuilder.js";

export class Mongoose implements IDatabase<Schema> {
  constructor() {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.DEBUG,
      "Launching Mongoose"
    );
  }

  private uri!: string;
  public setUri(uri: string) {
    if (uri) throw new Error("URI already provided!");
    this.uri = uri;
  }

  private models = ModelBuilder.models;
  public getModel<T extends Schema>(modelName: string): MongoDB.Model<T> {
    const model = this.models.get(modelName);
    if (!model) throw new Error(`Model ${modelName} not found!`);
    return model as unknown as MongoDB.Model<T>;
  }

  async connect(): Promise<void> {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "Connecting to MongoDB"
    );

    ModelBuilder.build();

    try {
      await MongoDB.connect(this.uri);
    } catch (e) {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.ERROR,
        `Error connecting to MongoDB: ${e}`
      );
      throw e;
    }

    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "Connected to MongoDB"
    );

    MongoDB.connection.on("connected", () => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        "Mongoose Connected"
      );
    });

    MongoDB.connection.on("disconnected", () => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        "Mongoose Disconnected"
      );
      process.exit(1);
    });

    MongoDB.connection.on("error", (err) => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.ERROR,
        `Mongoose Error: ${err}`
      );
    });
  }
}
