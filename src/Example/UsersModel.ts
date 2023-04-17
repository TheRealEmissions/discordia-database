import { DatabaseSchema } from "../Decorators/DatabaseSchema.js";
import { Model } from "../Model/Model.js";
import { Schema, SchemaType } from "../Types/SchemaType.js";

interface UserSchema extends Schema {
  type?: string;
}

export class UsersModel extends Model<UserSchema> {
  @DatabaseSchema
  static x: SchemaType<UserSchema> = {
    type: {
      type: String,
      required: false,
      default: "hello",
    },
  };
}
