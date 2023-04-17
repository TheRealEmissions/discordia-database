import { DocumentConstructor } from "../Types/DocumentConstructor";
import { Schema } from "../Types/SchemaType";
import App from "../App";

/**
 * @this {Document<T> & T}
 */
export class Document<T extends Schema> {
  private deleted = false;
  private outdated = false;

  constructor(public data: Required<T>, private schemaName: string) {}

  /**
   * Save the document to the database. Returns the document that was saved.
   */
  async save(): Promise<Document<T>> {
    if (this.deleted) throw new Error("Document already deleted");
    if (this.outdated) throw new Error("Document outdated");
    this.outdated = true;

    const database = App.getDatabaseClass();
    const exists = await database.findOne(this.schemaName, {
      _id: this.data._id,
    });
    if (!exists) {
      const result = await database.create(this.schemaName, this.data);
      return new Document(
        result as Required<Schema>,
        this.schemaName
      ) as Document<T>;
    } else {
      const result = await database.updateOne(
        this.schemaName,
        { _id: this.data._id },
        this.data
      );
      if (!result) throw new Error("Document not found");
      return new Document(
        result as Required<Schema>,
        this.schemaName
      ) as Document<T>;
    }
  }

  /**
   * Delete the document from the database. Returns the document that was deleted.
   */
  async delete(): Promise<Document<T>> {
    if (this.deleted) throw new Error("Document already deleted");
    this.deleted = true;

    const database = App.getDatabaseClass();
    const exists = await database.findOne(this.schemaName, {
      _id: this.data._id,
    });
    if (!exists) throw new Error("Document not found");
    const result = await database.deleteOne(this.schemaName, {
      _id: this.data._id,
    });
    if (!result) throw new Error("Document not found");
    return this;
  }

  /**
   * Overwrite the document with new data. Returns the document that was overwritten.
   * @param data
   * @returns
   */
  overwrite(data: Partial<DocumentConstructor<T>>): this {
    if (this.deleted) throw new Error("Document already deleted");
    if (this.outdated) throw new Error("Document outdated");
    Object.assign(this.data, data);
    return this;
  }
}
