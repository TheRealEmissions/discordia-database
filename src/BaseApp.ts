import Base from "ts-modular-bot-file-design";
import { Dependencies, Dependency } from "ts-modular-bot-types";
import Events from "ts-modular-bot-addon-events-types";
import { Database } from "./Enums/Database";
import { Config } from "../config/internal/Config";
import { Model } from "./Model/Model";
import { Schema, SchemaType } from "./Types/SchemaType";
import { DatabaseSchema } from "./Decorators/DatabaseSchema";

abstract class BaseApp extends Base {
  constructor() {
    super();
  }

  type: Dependency = Dependency.DATABASE; // you need to set this to the correct type! (Dependency.MY_ADDON)
  name: string = "Database"; // change this to the name of your addon!
  load = true; // ensure this is true!

  private static database: Database = this.getDatabaseFromConfig();
  private static getDatabaseFromConfig(): Database {
    // check if 2 or more databases are enabled
    if (Object.values(Config.database).filter((db) => db.enabled).length > 1) {
      throw new Error("Only 1 database can be enabled!");
    }

    if (Config.database.mongodb.enabled) return Database.MONGODB;
    if (Config.database.mysql.enabled) return Database.MYSQL;
    throw new Error("No database enabled!");
  }
  static getDatabase(): Database {
    return BaseApp.database;
  }

  private static schemas: Map<string, SchemaType<Schema>> = new Map();
  static addSchema<T extends Schema>(name: string, model: SchemaType<T>) {
    BaseApp.schemas.set(name, model);
  }
  static getSchema<T extends Schema>(name: string): SchemaType<T> {
    const schema = BaseApp.schemas.get(name);
    if (!schema) throw new Error(`Schema ${name} not found!`);
    return schema as SchemaType<T>;
  }
  static getSchemas() {
    return BaseApp.schemas;
  }

  abstract init(): Promise<void>;

  public get Schema() {
    return DatabaseSchema;
  }

  public get Model() {
    return Model;
  }

  @Dependencies.inject(Dependency.EVENTS)
  static Events: typeof Events;
  public getEvents() {
    return BaseApp.Events;
  }

  // Ensure that you specify the correct dependencies!
  getDependencies(): Dependency[] {
    return [Dependency.EVENTS];
  }
}

export default BaseApp;
