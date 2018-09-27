import React from "react";
import ReactDOM from "react-dom";
import use from "reuse";

const Box = use("div");

const Paper = ({ elevation = 1, ...props }) => (
  <Box
    {...props}
    style={{
      boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.3)`,
      ...props.style
    }}
  />
);

const Rounded = props => (
  <Box
    {...props}
    style={{
      borderRadius: 5,
      ...props.style
    }}
  />
);

const Button = use(
  props => (
    <Box
      {...props}
      style={{
        fontSize: 16,
        padding: "0 1em",
        lineHeight: "2.5em",
        background: "#3f51b5",
        color: "white",
        ...props.style
      }}
    />
  ),
  "button"
);

const PaperRoundedButton = use(Paper, Rounded, Button);

const App = () => <PaperRoundedButton elevation={2}>Button</PaperRoundedButton>;

ReactDOM.render(<App />, document.getElementById("root"));
