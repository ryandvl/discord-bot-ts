export interface ConfigProps {
  botDevelopers?: string[] | [];
  embedColors?: {
    [key: string]: string;
  };
  commandDescription?: string | null;
  supportServer?: string | null;
  loaders?: {
    commandsDir?: string | "commands";
    eventsDir?: string | "events";
  };
}
