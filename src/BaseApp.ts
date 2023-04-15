import Base from "ts-modular-bot-file-design";
import { Dependencies, Dependency } from "ts-modular-bot-types";
import Events from "ts-modular-bot-addon-events-types";
import DiscordClient from "ts-modular-bot-addon-discord_client-types";
import CommandHandler from "ts-modular-bot-addon-command_handler-types";

abstract class BaseApp extends Base {
  constructor() {
    super();
  }

  type: Dependency = -1; // you need to set this to the correct type! (Dependency.MY_ADDON)
  name: string = "Template"; // change this to the name of your addon!
  load = false; // ensure this is true!

  @Dependencies.inject(Dependency.EVENTS)
  static Events: typeof Events;
  public getEvents(): typeof Events {
    return BaseApp.Events;
  }

  @Dependencies.inject(Dependency.DISCORD_CLIENT)
  static DiscordClient: typeof DiscordClient;
  public getDiscordClient(): typeof DiscordClient {
    return BaseApp.DiscordClient;
  }

  @Dependencies.inject(Dependency.COMMAND_HANDLER)
  static CommandHandler: typeof CommandHandler;
  public getCommandHandler(): typeof CommandHandler {
    return BaseApp.CommandHandler;
  }

  abstract init(): Promise<void>;

  // Ensure that you specify the correct dependencies!
  getDependencies(): Dependency[] {
    return [
      Dependency.EVENTS,
      Dependency.DISCORD_CLIENT,
      Dependency.COMMAND_HANDLER,
    ];
  }
}

export default BaseApp;
