module.exports = {
  apps: [
    {
      name: "chats-service",
      script: "src/index.js",
      watch: true,
      ignore_watch: ["node_modules"],
      watch_delay: 100,
      watch_options: {
        followSymlinks: false,
        usePolling: true,
        interval: 500,
      },
    },
  ],
};
