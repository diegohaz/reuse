const { defaults } = require("jest-config");

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  testMatch: ["**/?(*.)+(spec|test).(j|t)s?(x)"],
  transform: {
    "\\.(j|t)sx?$": "babel-jest"
  }
};
