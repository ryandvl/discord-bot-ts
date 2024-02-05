import { ActivityType } from "discord.js";

import { writeEventLine } from "../utils/ConsoleColorful";
import Event from "../controller/Event";
import config from "../../config";
import { minutesToMs } from "../utils/Date";

const ACTIVITY_TYPE = {
  playing: ActivityType.Playing,
  streaming: ActivityType.Streaming,
  listening: ActivityType.Listening,
  watching: ActivityType.Watching,
  custom: ActivityType.Custom,
  competing: ActivityType.Competing,
};

export default new Event({
  async run() {
    this.translation.getEmojis();

    await this.registrySlashCommands();

    writeEventLine(`&aLogged in &c${this.user?.tag}&f.`, "events", "ready");

    this.user!.setStatus(config.status ?? "online");

    if (config.activities?.list?.(this)?.length) {
      let index = 0;

      var setActivity = () => {
        var activities = config.activities!.list(this);

        if (index == activities.length - 1) return;

        var activity = activities[index];

        this.user!.setActivity({
          ...activity,
          type: ACTIVITY_TYPE[activity.type],
        });

        index++;
      };

      setActivity();

      setTimeout(setActivity, config.activities?.changeTime ?? minutesToMs(5));
    }
  },
});
