import { Document } from "../../Model/Document";

class MysqlQueryBuilder {
  currentResult!: string;
  constructor(type: QueryType) {
    switch (type) {
      case QueryType.CREATE:
        this.currentResult = "CREATE TABLE ";
        break;
      case QueryType.INSERT:
        this.currentResult = "INSERT INTO ";
        break;
      case QueryType.UPDATE:
        this.currentResult = "UPDATE ";
      case QueryType.DELETE:
        this.currentResult = "DELETE FROM ";
      case QueryType.DROP:
        this.currentResult = "DROP ";
    }
  }

  what(it: string) {
    this.currentResult += it + " ";
  }

  filter();

  build(): string {
    return this.currentResult + ";";
  }

  static from(doc: Document<any>): string {
    return "";
  }

  static generateQuery(type: QueryType, doc: Document<any>): string {
    return "";
  }
}

enum QueryType {
  CREATE,
  INSERT,
  UPDATE,
  DELETE,
  DROP,
}
