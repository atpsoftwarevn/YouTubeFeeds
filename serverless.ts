import { serve } from "server";
import { webhookCallback } from "grammy/mod.ts";
import { bot, postFeeds } from "./bot.ts";
const handleUpdate = webhookCallback(bot, "std/http");
console.log(`Started @${bot.botInfo.username}`);
// Cron Job: Chạy mỗi 1 phút (Nhanh nhất)
Deno.cron("Check YouTube Feeds", "* * * * *", async () => {
  console.log("[Cron] Checking feeds...");
  await postFeeds();
});
serve(async (req) => {
  if (req.method === "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) === bot.token) {
      try {
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
      }
    }
  }
  return new Response();
});
