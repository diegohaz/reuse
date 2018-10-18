import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import use from "reuse";

const Paper = styled(use("div"))`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Rounded = styled(use("div"))`
  border-radius: 5px;
`;

const Button = styled(use("button"))`
  font-size: 16px;
  padding: 0 1em;
  line-height: 2.5em;
  background: #3f51b5;
  color: white;
  cursor: pointer;
`;

const PaperRoundedButton = use(Paper, Rounded, Button);

const App = () => <PaperRoundedButton>Button</PaperRoundedButton>;

ReactDOM.render(<App />, document.getElementById("root"));
