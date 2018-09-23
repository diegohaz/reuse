module.exports = {
  collectCoverageFrom: ["src/**"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testMatch: ["**/?(*.)+(spec|test).(j|t)s?(x)"],
  transform: {
    "\\.(j|t)sx?$": "babel-jest"
  }
};
