const { BABEL_ENV, NODE_ENV } = process.env;
const modules = BABEL_ENV === "cjs" || NODE_ENV === "test" ? "commonjs" : false;

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules,
        loose: true,
        targets: {
          browsers: "defaults"
        }
      }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ]
};
