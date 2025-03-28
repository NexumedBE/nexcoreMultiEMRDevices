import { FSWatcher } from "chokidar";

export let watchers: FSWatcher[] = [];
export let activeListeners = new Set<string>(); 

export const addWatcher = (watcher: FSWatcher) => {
  watchers.push(watcher);
};

export const stopWatchers = () => {
  console.log("🍺🍺 Stopping all file listeners...");

  if (watchers.length === 0) {
    console.log("⚠️ No active watchers found.");
  } else {
    watchers.forEach((watcher) => {
      console.log("🥃🥃 Stopping watcher...");
      watcher.close();
    });
    watchers = [];
    console.log("🐖🐖 All listeners successfully stopped.");
  }

  // ⬅️ Clear activeListeners too
  activeListeners.clear();
};
