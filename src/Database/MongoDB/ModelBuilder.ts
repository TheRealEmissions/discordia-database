import Mongoose from "mongoose";
import { Schema } from "../../Types/SchemaType.js";
import BaseApp from "../../BaseApp.js";
export class ModelBuilder {
  public static models = new Map<string, Mongoose.Model<Schema>>();
  public static build() {
    const schemas = BaseApp.getSchemas();
    for (const [name, schema] of schemas) {
      const model = Mongoose.model<Schema>(name, new Mongoose.Schema(schema));
      this.models.set(name, model);
    }
  }
}
