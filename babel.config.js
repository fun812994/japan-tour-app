module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./app/components",
            "@screens": "./app/screens",
            "@services": "./app/services",
            "@hooks": "./app/hooks",
            "@assets": "./app/assets",
          },
        },
      ],
    ],
  };
};
