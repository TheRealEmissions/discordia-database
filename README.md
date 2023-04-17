Database Addon
===

**This addon is not intended to be a replacement for a well-made database system.**

This addon is intended to be a simple, lightweight, and easy to use database system for Discordia **if you only need to store simple information**. It is not intended to be a replacement for a well-made database system, but rather a simple database system that can be used for simple projects.

_This module intentionally does not support any complex methods such as inner joins, outer joins, populations._

## Why is this addon useful?

- With out-of-the-box support for many different databases, this addon allows users to easily switch between databases without having to duplicate code for multiple different databases.
- This addon also allows you to easily create models with schemas, which allows you to easily validate your data.
- It's quick and easy to set up and use in your project.
- No need to worry about setting up your own database logic.
- Built-in type-safety for your data.
- Object-oriented design that allows you to manage your data in a more organised way.

## What databases are supported?

With more planned in the future, the following databases are currently supported:
- MongoDB
- MySQL

You do not need to worry about installing any of these databases, as they are all installed as dependencies of this addon. Nor do you need to worry about setting up the database, as this addon will do that for you.

How do I use this module?
===

You simply need to inject the module into your addon.
```ts
import Database from "discordia-database-types";

abstract class BaseApp extends Base {

  // ... rest of the class ...

  @Dependencies.inject(Dependency.DATABASE)
  static Database: typeof Database;

  // ... rest of the class ...

  // Make sure to add the dependency to the getDependencies() method!
}
```

From here you can use its functionality similar to how you would use other injected modules.

## Creating a model with a schema

```ts
import { Schema, SchemaType } from "discordia-database-types";
import BaseApp from "@src/BaseApp.js"; // @src is the src folder of your addon

interface YourSchema extends Schema {
  yourKey: string;
  anotherKey?: number; // Optional on document creation
}

export class YourModel extends BaseApp.Database.Model<YourSchema> {
  @BaseApp.Database.Schema
  static whateverYouNameThisWillBeTheCollectionName: SchemaType<YourSchema> = {
    yourKey: {
      type: String,
      required: true,
    },
    anotherKey: {
      type: Number,
      required: false,
      default: 0
    },
  };

  // A quick example of how you can use the model!
  async create(key: string) {
    let doc = await this.create({ yourKey: key }); // returns Document<YourSchema>

    doc.data.yourKey = "another key!"; // acceptable as yourKey is a string
    doc.data.yourKey = 69; // invalid!


    try {
      doc = await doc.save();
    } catch (e) {
      BaseApp.Events.getEventEmitter().emit(BaseApp.Events.GeneralEvents.ERROR, e);
      throw e;
    }
    console.log(doc); // { data: { yourKey: "another key!", anotherKey: 0}, ... helper methods ... }

    return doc;
  }
}
```

## Using a model

Here's a quick example:
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model

// ... rest of the file ...

const model = new YourModel();
const document = await model.create("DevRoom");
const foundDocument = await model.findOne({ yourKey: "DevRoom" });
const deletedDocument = await model.deleteOne({ yourKey: "DevRoom"});

// ... rest of the file ...
```

## The Model Class and its functionality

The Model class is the main class that you will be using to interact with your database, it is extended on your created models. It is a wrapper around the database drivers that allows you to easily create, find, update, and delete documents.

*Note:* You don't need to worry about type-casting methods, such as casting `findAll<YourSchema>` as the addon automatically assumes types based on your model.

- `Document` is a class that is returned by the model class, it is a wrapper around the data that is returned from the database driver. It allows you to easily access the data and also provides helper methods to easily update the data.
- `SearchQuery` is an interface that is used to define the query that is used to find documents. It is an object that contains the key and value that you want to search for.
- `DocumentConstructor` is an interface that is used to define the data that is used to create a document. It is an object that contains the key and value that you want to create, taking into account optionality and default values.


### `Model#findAll(query?: SearchQuery)`
**Returns:** `Promise<Document<YourSchema>[]>`
**Description:** Finds all documents that match the query.
**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const documents = await model.findAll({ yourKey: "DevRoom" });
```

### `Model#findAllAndDelete(query?: SearchQuery)`
**Returns:** `Promise<Document<YourSchema>[]>`

**Description:** Finds all documents that match the query and deletes them.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const documentsDeleted = await model.findAllAndDelete({ yourKey: "DevRoom" })
```

### `Model#findAllAndUpdate(query: SearchQuery | undefined, data: DocumentConstructor)`
**Returns:** `Promise<Document<YourSchema>[]>`

**Description:** Finds all documents that match the query and updates them with the data.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const documentsUpdated = await model.findAllAndUpdate({yourKey: "DevRoom", data: {
  anotherKey: 6
}});
```

### `Model#replaceAll(query: SearchQuery | undefined, data: DocumentConstructor)`
**Returns:** `Promise<Document<YourSchema>[]>`

**Description:** Finds all documents that match the query and replaces them with the data.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const documentsReplaced = await model.replaceAll({yourKey: "DevRoom", data: {
  yourKey: "DevRoom"
  // as per the YourSchema example, anotherKey is has a default value and is therefore not required on replacement
}});
```

### `Model#findOne(query: SearchQuery)`
**Returns:** `Promise<Document<YourSchema> | null>`

**Description:** Finds the first document that matches the query.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = await model.findOne({ yourKey: "DevRoom" });
```

### `Model#findOneAndDelete(query: SearchQuery)`
**Returns:** `Promise<Document<YourSchema> | null>`

**Description:** Finds the first document that matches the query and deletes it.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = await model.findOneAndDelete({ yourKey: "DevRoom" });
```

### `Model#findOneAndUpdate(query: SearchQuery, data: DocumentConstructor)`
**Returns:** `Promise<Document<YourSchema> | null>`

**Description:** Finds the first document that matches the query and updates it with the data.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = await model.findOneAndUpdate({ yourKey: "DevRoom"}, { anotherKey: 6 });
```

### `Model#replaceOne(query: SearchQuery, data: DocumentConstructor)`
**Returns:** `Promise<Document<YourSchema> | null>`

**Description:** Finds the first document that matches the query and replaces it with the data.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = await model.replaceOne({ yourKey: "DevRoom"}, { yourKey: "BuildRoom", anotherKey: 6 }); // although anotherKey is specified here, it *isn't* required on replacement as it has a default value
```

### `Model#new(data: DocumentConstructor)`
**Returns:** `Document<YourSchema>`

**Description:** Creates a new document with the data (does not save it to the database).

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = model.new({ yourKey: "DevRoom" });

// The document is currently not saved in the database!
// You can save it by calling document.save()

try {
  await document.save();
} catch (e) {
  throw e;
}
```

### `Model#create(data: DocumentConstructor)`
**Returns:** `Promise<Document<YourSchema>>`

**Description:** Creates a new document with the data and saves it to the database.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = await model.create({ yourKey: "DevRoom" });
```

### `Model#createMany(data: DocumentConstructor[])`
**Returns:** `Promise<Document<YourSchema>[]>`

**Description:** Creates multiple documents with the data and saves them to the database.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const documents = await model.createMany([
  { yourKey: "DevRoom" },
  { yourKey: "BuildRoom" }
]);
```

### `Model#deleteOne(query: SearchQuery)`
**Returns:** `Promise<Document<YourSchema> | null>`

**Description:** Finds the first document that matches the query and deletes it, if the document cannot be found it will return `null`

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = await model.deleteOne({ yourKey: "DevRoom" });
```

### `Model#deleteMany(query: SearchQuery)`
**Returns:** `Promise<Document<YourSchema>[]>`

**Description:** Finds all documents that match the query and deletes them.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const documents = await model.deleteMany({
  yourKey: "DevRoom"
});
```

### `Model#updateOne(query: SearchQuery, data: DocumentConstructor)`
**Returns:** `Promise<Document<YourSchema> | null>`

**Description:** Finds the first document that matches the query and updates it with the data, if the document cannot be found it will return `null`

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const document = await model.updateOne({yourKey: "DevRoom"}, { anotherKey: 6 }); // updates only what you specify!
```

### `Model#updateMany(query: SearchQuery, data: DocumentConstructor)`
**Returns:** `Promise<Document<YourSchema>[]>`

**Description:** Finds all documents that match the query and updates them with the data.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const documents = await model.updateMany({yourKey: "DevRoom"}, { anotherKey: 6 }); // updates only what you specify!
```

### `Model#count(query?: SearchQuery)`
**Returns:** `Promise<number>`

**Description:** Counts the number of documents that match the query.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const count = await model.count({ yourKey: "DevRoom" });
const totalCount = await model.count();
```

### `Model#exists(query: SearchQuery)`
**Returns:** `Promise<boolean>`

**Description:** Checks if a document exists that matches the query.

**Example use:**
```ts
import { YourModel } from "@src/models/YourModel.js"; // an example location of your model
const model = new YourModel();
const exists = await model.exists({ yourKey: "DevRoom" });
```