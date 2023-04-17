import App from "../App.js";
import BaseApp from "../BaseApp.js";
import { DocumentConstructor } from "../Types/DocumentConstructor.js";
import { Schema, SchemaType } from "../Types/SchemaType.js";
import { SearchQuery } from "../Types/SearchQuery.js";
import { Document } from "./Document.js";
import MongoDB from "mongoose";

export abstract class Model<T extends Schema> {
  getSchema(): object {
    const propertyKey = this.getSchemaName();
    return BaseApp.getSchema(propertyKey);
  }
  getSchemaName(): string {
    return Reflect.getMetadata("DatabaseSchema", this);
  }

  /**
   * Find all documents in the database that match the query. Returns an array of documents.
   * @param query
   */
  async findAll(
    query?: SearchQuery<T>
  ): Promise<Document<Required<Schema & T>>[]> {
    const database = App.getDatabaseClass();
    const result = await database.findAll(this.getSchemaName(), query);
    const documents = result.map(
      (data) => new Document(data as Required<Schema & T>, this.getSchemaName())
    );
    return documents;
  }

  /**
   * Find all documents in the database that match the query and deletes them. Returns an array of documents that were deleted.
   * @param query
   */
  async findAllAndDelete(
    query?: SearchQuery<T>
  ): Promise<Document<Required<Schema & T>>[]> {
    const database = App.getDatabaseClass();
    const result = await database.findAllAndDelete(this.getSchemaName(), query);
    const documents = result.map(
      (data) => new Document(data as Required<Schema & T>, this.getSchemaName())
    );
    return documents;
  }

  /**
   * Find all documents in the database that match the query and updates them. Returns an array of documents that were updated.
   * @param query
   * @param data
   */
  async findAllAndUpdate(
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<Document<Required<Schema & T>>[]> {
    const database = App.getDatabaseClass();
    const result = await database.findAllAndUpdate(
      this.getSchemaName(),
      query,
      data
    );
    const documents = result.map(
      (data) => new Document(data as Required<Schema & T>, this.getSchemaName())
    );
    return documents;
  }

  /**
   * Find all documents in the database that match the query and replaces them. Returns an array of documents that were replaced.
   */
  async replaceAll(
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<Document<Required<Schema & T>>[]> {
    const database = App.getDatabaseClass();
    const result = await database.replaceAll(this.getSchemaName(), query, data);
    const documents = result.map(
      (data) => new Document(data as Required<Schema & T>, this.getSchemaName())
    );
    return documents;
  }

  /**
   * Conditionally finds a single document in the database. First document that matches the query will be returned. Returns null if no document was found.
   * @param query
   */
  async findOne(
    query: SearchQuery<T>
  ): Promise<Document<Required<Schema & T>> | null> {
    const database = App.getDatabaseClass();
    const result = await database.findOne(this.getSchemaName(), query);
    if (result)
      return new Document(result as Required<Schema & T>, this.getSchemaName());
    else return null;
  }

  /**
   * Conditionally finds a single document in the database and deletes it. First document that matches the query will be deleted. Returns the document that was deleted.
   * @param query
   */
  async findOneAndDelete(
    query: SearchQuery<T>
  ): Promise<Document<Required<Schema & T>> | null> {
    const database = App.getDatabaseClass();
    const result = await database.findOneAndDelete(this.getSchemaName(), query);
    if (result)
      return new Document(result as Required<Schema & T>, this.getSchemaName());
    else return null;
  }

  /**
   * Conditionally finds a single document in the database and updates it. First document that matches the query will be updated. Returns the document that was updated.
   * @param query
   * @param data
   */
  async findOneAndUpdate(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<Document<Required<Schema & T>> | null> {
    const database = App.getDatabaseClass();
    const result = await database.findOneAndUpdate(
      this.getSchemaName(),
      query,
      data
    );
    if (result)
      return new Document(result as Required<Schema & T>, this.getSchemaName());
    else return null;
  }

  /**
   * Replace a document in the database that match the query. First document that matches the query will be replaced. Returns the document that was replaced.
   * @param query
   * @param data
   */
  async replaceOne(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<Document<Required<Schema & T>>> {
    const database = App.getDatabaseClass();
    const result = await database.replaceOne(this.getSchemaName(), query, data);
    if (!result) throw new Error("Document not found");
    return new Document(result as Required<Schema & T>, this.getSchemaName());
  }

  /**
   * Creates a new document that is persistent in memory ready to be saved to the database.
   * @param data
   */
  new(data: DocumentConstructor<T>): Document<Required<Schema & T>> {
    const objectId = new MongoDB.Types.ObjectId();

    const schemaName = this.getSchemaName();
    const schema = App.getSchema(schemaName);
    const keys = Object.keys(schema);
    const defaults: Partial<Schema & T> = {};
    for (const key of keys) {
      const val = schema[key as keyof SchemaType<Schema>];
      if (!val) continue;
      if (val.required) continue;
      defaults[key as keyof SchemaType<Schema>] = val.default;
    }
    return new Document(
      { ...data, _id: objectId.toString(), ...defaults } as Required<
        Schema & T
      >,
      this.getSchemaName()
    );
  }

  /**
   * Creates a new document and saves it to the database. Returns the document that was created.
   * @param data
   * @returns
   */
  async create(
    data: DocumentConstructor<T>
  ): Promise<Document<Required<Schema & T>>> {
    const database = App.getDatabaseClass();
    const result = await database.create(this.getSchemaName(), data);
    return new Document(result as Required<Schema & T>, this.getSchemaName());
  }

  /**
   * Creates multiple documents and saves them to the database. Returns the documents that were created.
   * @param data
   * @returns
   */
  async createMany(
    data: DocumentConstructor<T>[]
  ): Promise<Document<Required<Schema>>[]> {
    const database = App.getDatabaseClass();
    const result = await database.createMany(this.getSchemaName(), data);
    const documents = result.map(
      (data) => new Document(data as Required<Schema>, this.getSchemaName())
    );
    return documents;
  }

  /**
   * Delete a document in the database that match the query. First document that matches the query will be deleted.
   * Returns the document that was deleted.
   * @param query
   */
  async deleteOne(query: SearchQuery<T>): Promise<Document<Required<Schema>>> {
    const database = App.getDatabaseClass();
    const result = await database.deleteOne(this.getSchemaName(), query);
    if (!result) throw new Error("Document not found");
    return new Document(result as Required<Schema>, this.getSchemaName());
  }

  /**
   * Deletes all documents in the database that match the query. Returns the documents that were deleted.
   * @param query
   * @returns
   */
  async deleteMany(
    query: SearchQuery<T>
  ): Promise<Document<Required<Schema>>[]> {
    const database = App.getDatabaseClass();
    const result = await database.deleteMany(this.getSchemaName(), query);
    const documents = result.map(
      (data) => new Document(data as Required<Schema>, this.getSchemaName())
    );
    return documents;
  }

  /**
   * Updates a document in the database that match the query. First document that matches the query will be updated. Returns the document that was updated.
   * @param query
   * @param data
   * @returns
   */
  async updateOne(
    query: SearchQuery<T>,
    data: Partial<DocumentConstructor<T>>
  ): Promise<Document<Required<Schema>>> {
    const database = App.getDatabaseClass();
    const result = await database.updateOne(this.getSchemaName(), query, data);
    if (!result) throw new Error("Document not found");
    return new Document(result as Required<Schema>, this.getSchemaName());
  }

  /**
   * Updates all documents in the database that match the query. Returns the documents that were updated.
   * @param query
   * @param data
   * @returns
   */
  async updateMany(
    query: SearchQuery<T>,
    data: Partial<DocumentConstructor<T>>
  ): Promise<Document<Required<Schema>>[]> {
    const database = App.getDatabaseClass();
    const result = await database.updateMany(this.getSchemaName(), query, data);
    const documents = result.map(
      (data) => new Document(data as Required<Schema>, this.getSchemaName())
    );
    return documents;
  }

  /**
   * Counts the number of documents in the database that match the query. Returns the number of documents.
   * @param query
   * @returns
   */
  async count(query?: SearchQuery<T>): Promise<number> {
    const database = App.getDatabaseClass();
    const result = await database.findAll(this.getSchemaName(), query);
    return result.length;
  }

  /**
   * Checks if a document exists in the database that matches the query. Returns true if a document was found, false otherwise.
   * @param query
   * @returns
   */
  async exists(query: SearchQuery<T>): Promise<boolean> {
    const database = App.getDatabaseClass();
    const result = await database.findOne(this.getSchemaName(), query);
    return !!result;
  }
}
