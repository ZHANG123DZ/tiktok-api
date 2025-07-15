require("dotenv").config();
require("module-alias/register");
const cron = require("node-cron");

const queue = require("@/utils/queue");

cron.schedule("* * * 4 4", () => {
  const number = Math.round(Math.random() * 30);
  queue.dispatch("scheduledAnnouncementEmail", number);
});
