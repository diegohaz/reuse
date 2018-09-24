import React from "react";
import ReactDOM from "react-dom";
import use from "reuse";

const Box = use("div");

const App = () => <Box>Box</Box>;

ReactDOM.render(<App />, document.getElementById("root"));
