import { DocumentConstructor } from "../Types/DocumentConstructor";
import { Schema } from "../Types/SchemaType";
import { SearchQuery } from "../Types/SearchQuery";

export interface IDatabase<T extends Schema> {
  connect(): Promise<void>;
  build(): void;
  findAll(modelName: string, query?: SearchQuery<T>): Promise<object[]>;
  findAllAndDelete(
    modelName: string,
    query?: SearchQuery<T>
  ): Promise<object[]>;
  findAllAndUpdate(
    modelName: string,
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<object[]>;
  findOne(modelName: string, query: SearchQuery<T>): Promise<object | null>;
  findOneAndDelete(
    modelName: string,
    query: SearchQuery<T>
  ): Promise<object | null>;
  findOneAndUpdate(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object | null>;
  replaceOne(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object | null>;
  replaceAll(
    modelName: string,
    query: SearchQuery<T> | undefined,
    data: DocumentConstructor<T>
  ): Promise<object[]>;
  create(modelName: string, data: DocumentConstructor<T>): Promise<object>;
  createMany(
    modelName: string,
    data: DocumentConstructor<T>[]
  ): Promise<object[]>;
  deleteOne(modelName: string, query: SearchQuery<T>): Promise<object | null>;
  deleteMany(modelName: string, query: SearchQuery<T>): Promise<object[]>;
  updateOne(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object | null>;
  updateMany(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object[]>;
}
