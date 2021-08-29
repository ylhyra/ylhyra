import { exec } from "child_process";

let queue = [];
let NOTIFY_EVERY_X_MINUTES = 60;
let last_sent = null;
let timer = null;

export const notifyOfError = (descr) => {
  if (!process.env.NOTIFY_APP_KEY) return;
  if (process.platform === "darwin") return; //Mac
  if (descr) {
    queue.push(descr);
  }
  if (queue.length <= 0) {
    return;
  }
  const now = new Date().getTime();
  timer && clearTimeout(timer);
  if (last_sent && now - last_sent < NOTIFY_EVERY_X_MINUTES * 60 * 1000) {
    timer = setTimeout(() => {
      notifyOfError();
    }, NOTIFY_EVERY_X_MINUTES * 61 * 1000 - (now - last_sent));
    // console.log("scheduled in " + (now - last_sent) / 1000);
    return;
  }
  exec(
    `curl -X POST -s \
      --form-string "app_key=${process.env.NOTIFY_APP_KEY}" \
      --form-string "app_secret=${process.env.NOTIFY_APP_SECRET}" \
      --form-string "target_type=app" \
      --form-string "content=${queue.length} errors: ${queue
      .join(" — ")
      .slice(0, 300)
      .replace(/(["'$`\n\\])/g, " ")}" \
      https://api.pushed.co/1/push
  `
  );
  last_sent = now;
  queue = [];
};
