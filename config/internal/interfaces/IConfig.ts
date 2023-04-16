interface DatabaseEnabled {
  enabled: boolean;
}

export interface IConfig {
  database: {
    mongodb: DatabaseEnabled & {
      uri: string;
    };
    mysql: DatabaseEnabled & {
      host: string;
      user: string;
      password: string;
      database: string;
      waitForConnections: boolean;
      connectionLimit: number;
      queueLimit: number;
      maxIdle: number;
      idleTimeout: number;
    };
  };
}
