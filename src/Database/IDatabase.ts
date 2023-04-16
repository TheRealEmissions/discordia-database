import { DocumentConstructor } from "../Types/DocumentConstructor";
import { Schema } from "../Types/SchemaType";
import { SearchQuery } from "../Types/SearchQuery";

export interface IDatabase<T extends Schema> {
  connect(): Promise<void>;
  findAll(query?: SearchQuery<T>): Promise<object>;
  findAllAndDelete(query?: SearchQuery<T>): Promise<object>;
  findAllAndUpdate(
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<object>;
  replaceAll(
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<object>;
  findOne(query: SearchQuery<T>): Promise<object>;
  findOneAndDelete(query: SearchQuery<T>): Promise<object>;
  findOneAndUpdate(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object>;
  replaceOne(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object>;
  create(data: DocumentConstructor<T>): Promise<object>;
  createMany(data: DocumentConstructor<T>[]): Promise<object>;
  deleteOne(query: SearchQuery<T>): Promise<object>;
  deleteMany(query: SearchQuery<T>): Promise<object>;
  updateOne(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object>;
  updateMany(
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object>;
}
