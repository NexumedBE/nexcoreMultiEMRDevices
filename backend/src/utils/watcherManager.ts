import { FSWatcher } from "chokidar";

export let watchers: FSWatcher[] = [];

export const addWatcher = (watcher: FSWatcher) => {
  watchers.push(watcher);
};

export const stopWatchers = () => {
  console.log("🍺🍺 Stopping all file listeners...");

  if (watchers.length === 0) {
    console.log("⚠️ No active watchers found.");
    return;
  }

  // Stop and clear all watchers
  watchers.forEach((watcher) => {
    console.log("🥃🥃 Stopping watcher...");
    watcher.close();
  });

  watchers = []; // Clear the array

  console.log("🐖🐖 All listeners successfully stopped.");
};
