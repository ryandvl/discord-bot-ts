export interface ConfigProps {
  developers?: string[] | [];
  supportServer?: string | null;
  loaders?: {
    commandsDir?: string | "commands";
    eventsDir?: string | "events";
  };
}
