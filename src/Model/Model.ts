import BaseApp from "../BaseApp.js";
import { DocumentConstructor } from "../Types/DocumentConstructor.js";
import { Schema } from "../Types/SchemaType.js";
import { SearchQuery } from "../Types/SearchQuery.js";
import { Document } from "./Document.js";

export abstract class Model<T extends Schema> {
  static getSchema(): object {
    const propertyKey = this.getSchemaName();
    return BaseApp.getSchema(propertyKey);
  }
  static getSchemaName(): string {
    return Reflect.getMetadata("DatabaseSchema", this);
  }

  /**
   * Find all documents in the database that match the query. Returns an array of documents.
   * @param query
   */
  async findAll(query?: SearchQuery<T>): Promise<Document<T>[]> {}

  /**
   * Find all documents in the database that match the query and deletes them. Returns an array of documents that were deleted.
   * @param query
   */
  async findAllAndDelete(query?: SearchQuery<T>): Promise<Document<T>[]> {}

  /**
   * Find all documents in the database that match the query and updates them. Returns an array of documents that were updated.
   * @param query
   * @param data
   */
  async findAllAndUpdate(
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<Document<T>[]> {}

  /**
   * Find all documents in the database that match the query and replaces them. Returns an array of documents that were replaced.
   */
  async replaceAll(
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<Document<T>[]> {}

  /**
   * Conditionally finds a single document in the database. First document that matches the query will be returned. Returns null if no document was found.
   * @param query
   */
  async findOne(query: SearchQuery<T>): Promise<Document<T> | null> {}

  /**
   * Conditionally finds a single document in the database and deletes it. First document that matches the query will be deleted. Returns the document that was deleted.
   * @param query
   */
  async findOneAndDelete(query: SearchQuery<T>): Promise<Document<T> | null> {}

  /**
   * Conditionally finds a single document in the database and updates it. First document that matches the query will be updated. Returns the document that was updated.
   * @param query
   * @param data
   */
  async findOneAndUpdate(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<Document<T> | null> {}

  /**
   * Replace a document in the database that match the query. First document that matches the query will be replaced. Returns the document that was replaced.
   * @param query
   * @param data
   */
  async replaceOne(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<Document<T>> {}

  /**
   * Creates a new document that is persistent in memory ready to be saved to the database.
   * @param data
   */
  new(data: DocumentConstructor<T>): Document<T> {}

  /**
   * Creates a new document and saves it to the database. Returns the document that was created.
   * @param data
   * @returns
   */
  async create(data: DocumentConstructor<T>): Promise<Document<T>> {}

  /**
   * Creates multiple documents and saves them to the database. Returns the documents that were created.
   * @param data
   * @returns
   */
  async createMany(data: DocumentConstructor<T>[]): Promise<Document<T>[]> {}

  /**
   * Delete a document in the database that match the query. First document that matches the query will be deleted.
   * Returns the document that was deleted.
   * @param query
   */
  async deleteOne(query: SearchQuery<T>): Promise<Document<T>> {}

  /**
   * Deletes all documents in the database that match the query. Returns the documents that were deleted.
   * @param query
   * @returns
   */
  async deleteMany(query: SearchQuery<T>): Promise<Document<T>[]> {}

  /**
   * Updates a document in the database that match the query. First document that matches the query will be updated. Returns the document that was updated.
   * @param query
   * @param data
   * @returns
   */
  async updateOne(
    query: SearchQuery<T>,
    data: Partial<DocumentConstructor<T>>
  ): Promise<Document<T>> {}

  /**
   * Updates all documents in the database that match the query. Returns the documents that were updated.
   * @param query
   * @param data
   * @returns
   */
  async updateMany(
    query: SearchQuery<T>,
    data: Partial<DocumentConstructor<T>>
  ): Promise<Document<T>[]> {}

  /**
   * Counts the number of documents in the database that match the query. Returns the number of documents.
   * @param query
   * @returns
   */
  async count(query?: SearchQuery<T>): Promise<number> {}

  /**
   * Checks if a document exists in the database that matches the query. Returns true if a document was found, false otherwise.
   * @param query
   * @returns
   */
  async exists(query: SearchQuery<T>): Promise<boolean> {}
}
