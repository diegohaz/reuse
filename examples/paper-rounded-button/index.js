import React from "react";
import ReactDOM from "react-dom";
import use from "reuse";

const Box = use("div");

const Paper = ({ depth = 1, ...props }) => (
  <Box
    {...props}
    style={{
      boxShadow: `0 ${depth}px ${depth * 2}px rgba(0, 0, 0, 0.15)`,
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

const Button = props => (
  <Box
    use="button"
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
);

const PaperRoundedButton = use(Paper, Rounded, Button);

const App = () => <PaperRoundedButton>Button</PaperRoundedButton>;

ReactDOM.render(<App />, document.getElementById("root"));
