import { DatabaseSchema } from "../Decorators/DatabaseSchema.js";
import { Model } from "../Model/Model.js";
import { Schema, SchemaType } from "../Types/SchemaType.js";

interface UserSchema extends Schema {
  type?: string;
  another?: number;
  wow: boolean;
}

export class UsersModel extends Model<UserSchema> {
  @DatabaseSchema
  static x: SchemaType<UserSchema> = {
    type: {
      type: String,
      required: false,
      default: "hello",
    },
    another: {
      type: Number,
      required: false,
      default: 5,
    },
    wow: {
      type: Boolean,
      required: true,
    },
  };
}
