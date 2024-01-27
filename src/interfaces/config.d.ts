export interface ConfigProps {
  developers?: string[] | [];
  embedColors?: {
    [key: string]: string;
  };
  supportServer?: string | null;
  loaders?: {
    commandsDir?: string | "commands";
    eventsDir?: string | "events";
  };
}
