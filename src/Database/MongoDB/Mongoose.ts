import BaseApp from "../../BaseApp.js";
import { Schema } from "../../Types/SchemaType.js";
import { IDatabase } from "../IDatabase.js";
import MongoDB from "mongoose";
import { ModelBuilder } from "./ModelBuilder.js";
import { SearchQuery } from "../../Types/SearchQuery.js";
import { DocumentConstructor } from "../../Types/DocumentConstructor.js";

type MongoSchema = Omit<Schema, "_id"> & {
  _id?: string | MongoDB.Types.ObjectId;
};

export class Mongoose implements IDatabase<Schema> {
  constructor() {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.DEBUG,
      "Launching Mongoose"
    );
  }

  private uri!: string;
  public setUri(uri: string) {
    if (uri) throw new Error("URI already provided!");
    this.uri = uri;
  }

  private models = ModelBuilder.models;
  public getModel<T extends MongoSchema>(modelName: string): MongoDB.Model<T> {
    const model = this.models.get(modelName);
    if (!model) throw new Error(`Model ${modelName} not found!`);
    return model as unknown as MongoDB.Model<T>;
  }

  public build() {
    ModelBuilder.build();
  }

  async connect(): Promise<void> {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "Connecting to MongoDB"
    );

    ModelBuilder.build();

    try {
      await MongoDB.connect(this.uri);
    } catch (e) {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.ERROR,
        `Error connecting to MongoDB: ${e}`
      );
      throw e;
    }

    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "Connected to MongoDB"
    );

    MongoDB.connection.on("connected", () => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        "Mongoose Connected"
      );
    });

    MongoDB.connection.on("disconnected", () => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        "Mongoose Disconnected"
      );
      process.exit(1);
    });

    MongoDB.connection.on("error", (err) => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.ERROR,
        `Mongoose Error: ${err}`
      );
    });
  }

  private transformQuery<T extends MongoSchema>(query?: SearchQuery<T>) {
    if (!query) return undefined;
    if (query._id) {
      query._id = new MongoDB.Types.ObjectId(query._id);
    }
    return query;
  }

  async findAll<T extends MongoSchema>(
    modelName: string,
    query?: SearchQuery<T>
  ): Promise<object[]> {
    const model = this.getModel(modelName);
    const docs = await model
      .find(this.transformQuery(query) ?? {})
      .lean()
      .exec();
    return docs;
  }

  async findAllAndDelete<T extends MongoSchema>(
    modelName: string,
    query?: SearchQuery<T>
  ): Promise<object[]> {
    const model = this.getModel(modelName);
    const docs = await this.findAll(modelName, query);
    await model.deleteMany(this.transformQuery(query) ?? {}).exec();
    return docs;
  }

  async findAllAndUpdate<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object[]> {
    const model = this.getModel(modelName);
    const docs = await model.find(this.transformQuery(query) ?? {}).exec();
    for (const doc of docs) {
      Object.assign(doc, data);
      doc.save();
    }
    return this.findAll(modelName, query);
  }

  async replaceAll<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object[]> {
    const model = this.getModel(modelName);
    const docs = await model.find(this.transformQuery(query) ?? {}).exec();
    const returnedDocs = [];
    for (const doc of docs) {
      const newDoc = await this.replaceOne(
        modelName,
        { _id: doc._id } as SearchQuery<T>,
        data
      );
      if (!newDoc) throw new Error("Error replacing document!");
      returnedDocs.push(newDoc);
    }
    return returnedDocs;
  }

  async findOne<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>
  ): Promise<object | null> {
    const model = this.getModel(modelName);
    const doc = await model.findOne(this.transformQuery(query)).lean().exec();
    return doc;
  }

  async findOneAndDelete<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>
  ): Promise<object | null> {
    const model = this.getModel(modelName);
    const doc = await model
      .findOneAndDelete(this.transformQuery(query))
      .lean()
      .exec();
    return doc;
  }

  async findOneAndUpdate<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object | null> {
    const model = this.getModel(modelName);
    const doc = await model
      .findOneAndUpdate(this.transformQuery(query), { $set: data })
      .lean()
      .exec();
    return doc;
  }

  async replaceOne<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object | null> {
    const model = this.getModel(modelName);
    const doc = await model
      .replaceOne(this.transformQuery(query), data)
      .lean()
      .exec();
    return doc;
  }

  async create<T extends MongoSchema>(
    modelName: string,
    data: DocumentConstructor<T>
  ): Promise<object> {
    const model = this.getModel(modelName);
    const doc = await model.create(this.transformQuery(data));
    return doc;
  }

  async createMany<T extends MongoSchema>(
    modelName: string,
    data: DocumentConstructor<T>[]
  ): Promise<object[]> {
    const model = this.getModel(modelName);
    const docs = await model.insertMany(this.transformQuery(data));
    return docs;
  }

  async updateOne<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object | null> {
    const model = this.getModel(modelName);
    const doc = await model
      .updateOne(this.transformQuery(query), {
        $set: this.transformQuery(data),
      })
      .lean()
      .exec();
    return doc;
  }

  async updateMany<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>,
    data: DocumentConstructor<T>
  ): Promise<object[]> {
    const model = this.getModel(modelName);
    const docs = await model.find(this.transformQuery(query) ?? {}).exec();
    for (const doc of docs) {
      Object.assign(doc, data);
      doc.save();
    }
    return this.findAll(modelName, query);
  }

  async deleteOne<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>
  ): Promise<object | null> {
    const model = this.getModel(modelName);
    const doc = await model.deleteOne(this.transformQuery(query)).lean().exec();
    return doc;
  }

  async deleteMany<T extends MongoSchema>(
    modelName: string,
    query: SearchQuery<T>
  ): Promise<object[]> {
    const model = this.getModel(modelName);
    const leanedDocs = await model
      .find(this.transformQuery(query) ?? {})
      .lean()
      .exec();
    const docs = await model.find(this.transformQuery(query) ?? {}).exec();
    await Promise.all(
      docs.map((x) =>
        this.deleteOne(modelName, { _id: x._id } as SearchQuery<T>)
      )
    );
    return leanedDocs;
  }
}
