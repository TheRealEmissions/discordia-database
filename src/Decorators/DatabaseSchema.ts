import "reflect-metadata";
import BaseApp from "../BaseApp";

export function DatabaseSchema(target: any, propertyKey: string) {
  Reflect.defineMetadata("DatabaseSchema", true, target, propertyKey);
  BaseApp.addSchema(propertyKey, target[propertyKey]);
}
