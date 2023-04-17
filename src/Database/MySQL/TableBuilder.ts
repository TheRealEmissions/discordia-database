import MYSQL from "mysql2/promise";
import BaseApp from "../../BaseApp.js";
import { MySQL } from "./MySQL";
export class TableBuilder {
  private static tablesBuilt = false;
  private static getDataType(type: any) {
    if (Array.isArray(type)) {
      return `JSON`;
    } else {
      if (typeof type === "string") {
        return `TEXT`;
      } else if (typeof type === "number") {
        return `VARCHAR(255)`;
      } else if (typeof type === "boolean") {
        return `BOOLEAN`;
      } else if (type instanceof Date) {
        return `DATE`;
      }
    }
  }

  public static async build(cl: MySQL) {
    if (this.tablesBuilt) return;
    this.tablesBuilt = true;
    const schemas = BaseApp.getSchemas();
    for (const [name, schema] of schemas) {
      const keys = Object.keys(schema);
      const values = Object.values(schema);
      const queryText = `CREATE TABLE IF NOT EXISTS ${name} (_id VARCHAR(255) PRIMARY KEY, ${keys
        .map(
          (key) => `${key} ${this.getDataType(values[keys.indexOf(key)].type)}`
        )
        .join(", ")})`;
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        "Setting up MySQL table: ",
        queryText
      );
      const q = await cl.getConnection().query(queryText);
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        "MySQL table setup: ",
        q
      );
    }
  }
}
