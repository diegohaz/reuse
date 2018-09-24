import React from "react";
import ReactDOM from "react-dom";
import use from "reuse";
import styled from "styled-components";

const Box = styled(use("div"))`
  background: palevioletred;
  color: white;
`;

const App = () => <Box use="span">StyledBox</Box>;

ReactDOM.render(<App />, document.getElementById("root"));
