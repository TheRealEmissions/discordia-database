import { Config } from "../config/internal/Config.js";
import BaseApp from "./BaseApp.js";
import { Mongoose } from "./Database/MongoDB/Mongoose.js";
import { MySQL } from "./Database/MySQL/MySQL.js";
import { Database } from "./Enums/Database.js";

class App extends BaseApp {
  constructor() {
    super();
  }

  private databaseClass!: MySQL | Mongoose;
  public getDatabaseClass() {
    return this.databaseClass;
  }

  async init(): Promise<void> {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "Database Loaded"
    );

    const database = BaseApp.getDatabase();
    switch (database) {
      case Database.MONGODB:
        this.loadMongoDB();
      case Database.MYSQL:
        this.loadMySQL();
    }
  }

  async loadMongoDB() {
    const db = (this.databaseClass = new Mongoose());
    db.setUri(Config.database.mongodb.uri);
    await db.connect();
  }

  async loadMySQL() {
    const db = (this.databaseClass = new MySQL());
    db.setHost(Config.database.mysql.host);
    db.setUser(Config.database.mysql.user);
    db.setPassword(Config.database.mysql.password);
    db.setDatabase(Config.database.mysql.database);
    db.setWaitForConnections(Config.database.mysql.waitForConnections);
    db.setConnectionLimit(Config.database.mysql.connectionLimit);
    db.setQueueLimit(Config.database.mysql.queueLimit);
    db.setMaxIdle(Config.database.mysql.maxIdle);
    await db.connect();
  }
}

export default App;
