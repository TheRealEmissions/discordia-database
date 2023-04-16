import BaseApp from "../../BaseApp";
import { Schema } from "../../Types/SchemaType";
import { IDatabase } from "../IDatabase";
import MYSQL from "mysql2/promise";

export class MySQL implements IDatabase<Schema> {
  constructor() {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.DEBUG,
      "Launching MySQL"
    );
  }

  //#region VARIABLES
  private host!: string;
  public setHost(host: string) {
    if (host) throw new Error("Host already provided!");
    this.host = host;
  }

  private user!: string;
  public setUser(user: string) {
    if (user) throw new Error("User already provided!");
    this.user = user;
  }

  private password!: string;
  public setPassword(password: string) {
    if (password) throw new Error("Password already provided!");
    this.password = password;
  }

  private database!: string;
  public setDatabase(database: string) {
    if (database) throw new Error("Database already provided!");
    this.database = database;
  }

  private waitForConnections!: boolean;
  public setWaitForConnections(waitForConnections: boolean) {
    if (waitForConnections)
      throw new Error("Wait for connections already provided!");
    this.waitForConnections = waitForConnections;
  }

  private connectionLimit!: number;
  public setConnectionLimit(connectionLimit: number) {
    if (connectionLimit) throw new Error("Connection limit already provided!");
    this.connectionLimit = connectionLimit;
  }

  private queueLimit!: number;
  public setQueueLimit(queueLimit: number) {
    if (queueLimit) throw new Error("Queue limit already provided!");
    this.queueLimit = queueLimit;
  }

  private maxIdle!: number;
  public setMaxIdle(maxIdle: number) {
    if (maxIdle) throw new Error("Max idle already provided!");
    this.maxIdle = maxIdle;
  }

  private idleTimeout!: number;
  public setIdleTimeout(idleTimeout: number) {
    if (idleTimeout) throw new Error("Idle timeout already provided!");
    this.idleTimeout = idleTimeout;
  }

  private connection!: MYSQL.Pool;
  public getConnection() {
    return this.connection;
  }
  private setConnection(connection: MYSQL.Pool) {
    this.connection = connection;
  }
  //#endregion VARIABLES

  async connect(): Promise<void> {
    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "Connecting to MySQL"
    );

    const pool = MYSQL.createPool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      waitForConnections: this.waitForConnections,
      connectionLimit: this.connectionLimit,
      queueLimit: this.queueLimit,
      maxIdle: this.maxIdle,
      idleTimeout: this.idleTimeout,
    });

    this.setConnection(pool);

    pool.on("connection", (connection) => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        `MySQL Connection ID: ${connection.threadId}`
      );
    });

    pool.on("release", (connection) => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        `MySQL Connection ID: ${connection.threadId} released`
      );
    });

    pool.on("enqueue", () => {
      BaseApp.Events.getEventEmitter().emit(
        BaseApp.Events.GeneralEvents.DEBUG,
        "MySQL Waiting for available connection slot"
      );
    });

    BaseApp.Events.getEventEmitter().emit(
      BaseApp.Events.GeneralEvents.INFO,
      "MySQL Connected"
    );
  }
}
