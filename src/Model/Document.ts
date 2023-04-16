import { EventEmitter } from "node:events";
import { ValidationResult } from "../Types/ValidationResult";
import { DocumentConstructor } from "../Types/DocumentConstructor";
import { Schema } from "../Types/SchemaType";

/**
 * @this {Document<T> & T}
 */
export class Document<T extends Schema> {
  private deleted = false;
  private outdated = false;

  constructor(public data: T) {}

  /**
   * Save the document to the database. Returns the document that was saved.
   */
  async save(): Promise<Document<T>> {
    if (this.deleted) throw new Error("Document already deleted");
    if (this.outdated) throw new Error("Document outdated");
    this.outdated = true;
  }

  /**
   * Delete the document from the database. Returns the document that was deleted.
   */
  async delete(): Promise<Document<T>> {
    if (this.deleted) throw new Error("Document already deleted");
    this.deleted = true;
  }

  /**
   * Validate the document before saving. Returns a ValidationResult object.
   */
  validate(key?: keyof T): ValidationResult {}

  /**
   * Overwrite the document with new data. Returns the document that was overwritten.
   * @param data
   * @returns
   */
  overwrite(data: Partial<DocumentConstructor<T>>): this {
    Object.assign(this, data);
    return this;
  }
}
