import * as React from "react";
import use from "../src";
import { getTreeJson } from "./testUtils";

// Serialize `[Function]`
expect.addSnapshotSerializer({
  test: val => typeof val === "function",
  print: val => val.name
});

// Serialize `React.forwardRef`
expect.addSnapshotSerializer({
  test: val =>
    val &&
    typeof val.$$typeof === "symbol" &&
    val.$$typeof.toString() === "Symbol(react.forward_ref)",
  print: () => "ForwardRef"
});

type UseProps = { use?: React.ReactType; children?: React.ReactNode };

test("use component", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const UseBox = use(Box);
  expect(getTreeJson(<UseBox />)).toMatchInlineSnapshot(`
<Box>
  <div />
</Box>
`);
});

test("different underlying element", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const BoxSpan = use(Box, "span");
  expect(getTreeJson(<BoxSpan />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useNext="span"
>
  <span />
</Box>
`);
});

test("use component without default use prop", () => {
  const Box = ({ use: T, ...props }: UseProps) => (T ? <T {...props} /> : null);
  const UseBox = use(Box);
  expect(getTreeJson(<UseBox />)).toMatchInlineSnapshot(`<Box />`);
});

test("two different components", () => {
  const Box1 = ({ use: T = "div", ...props }) => <T {...props} />;
  const Box2 = ({ use: T = "span", ...props }) => <T {...props} />;
  const Box1Box2 = use(Box1, Box2);
  expect(getTreeJson(<Box1Box2 />)).toMatchInlineSnapshot(`
<Box1
  use={ForwardRef}
  useNext={Box2}
>
  <Box2>
    <span />
  </Box2>
</Box1>
`);
});

test("two different components rendering the same", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const Box1: React.SFC = props => <Box {...props} />;
  const Box2: React.SFC = props => <Box {...props} />;
  const Box1Box2 = use(Box1, Box2);
  expect(getTreeJson(<Box1Box2 />)).toMatchInlineSnapshot(`
<Box1
  use={ForwardRef}
  useNext={Box2}
>
  <Box
    use={ForwardRef}
    useNext={Box2}
  >
    <Box2>
      <Box>
        <div />
      </Box>
    </Box2>
  </Box>
</Box1>
`);
});

test("two components and a different underlying element", () => {
  const Box1 = ({ use: T = "div", ...props }) => <T {...props} />;
  const Box2 = ({ use: T = "span", ...props }) => <T {...props} />;
  const Box1Box2 = use(Box1, Box2, "a");
  expect(getTreeJson(<Box1Box2 />)).toMatchInlineSnapshot(`
<Box1
  use={ForwardRef}
  useNext={
    Array [
      Box2,
      "a",
    ]
  }
>
  <Box2
    use={ForwardRef}
    useNext="a"
  >
    <a />
  </Box2>
</Box1>
`);
});

test("use component with custom prop", () => {
  const Box = ({ use: T = "div", ...props }: UseProps & { foo: string }) => (
    <T {...props} />
  );
  const UseBox = use(Box);
  expect(getTreeJson(<UseBox foo="" />)).toMatchInlineSnapshot(`
<Box
  foo=""
>
  <div
    foo=""
  />
</Box>
`);
});

test("two different components with custom props", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps & { foo: string }) => (
    <T {...props} />
  );
  const Box2 = ({ use: T = "span", ...props }: UseProps & { bar: string }) => (
    <T {...props} />
  );
  const Box1Box2 = use(Box1, Box2);
  expect(getTreeJson(<Box1Box2 foo="" bar="" />)).toMatchInlineSnapshot(`
<Box1
  bar=""
  foo=""
  use={ForwardRef}
  useNext={Box2}
>
  <Box2
    bar=""
    foo=""
  >
    <span
      bar=""
      foo=""
    />
  </Box2>
</Box1>
`);
});

test("use component with use prop", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const UseBox = use(Box);
  expect(getTreeJson(<UseBox use="span" />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useNext="span"
>
  <span />
</Box>
`);
});

test("use component with same use prop", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const UseBox = use(Box);
  expect(getTreeJson(<UseBox use="div" />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useNext="div"
>
  <div />
</Box>
`);
});

test("two different components with custom props and use prop", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps & { foo: string }) => (
    <T {...props} />
  );
  const Box2 = ({ use: T = "span", ...props }: UseProps & { bar: string }) => (
    <T {...props} />
  );
  const Box1Box2 = use(Box1, Box2);
  expect(getTreeJson(<Box1Box2 use="a" foo="" bar="" />))
    .toMatchInlineSnapshot(`
<Box1
  bar=""
  foo=""
  use={ForwardRef}
  useNext={
    Array [
      Box2,
      "a",
    ]
  }
>
  <Box2
    bar=""
    foo=""
    use={ForwardRef}
    useNext="a"
  >
    <a
      bar=""
      foo=""
    />
  </Box2>
</Box1>
`);
});

test("use component with use prop as other component", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const Box2 = ({ use: T = "span", ...props }: UseProps) => <T {...props} />;
  const UseBox1 = use(Box1);
  expect(getTreeJson(<UseBox1 use={Box2} />)).toMatchInlineSnapshot(`
<Box1
  use={ForwardRef}
  useNext={Box2}
>
  <Box2>
    <span />
  </Box2>
</Box1>
`);
});

test("use component with use prop as other use component", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const Box2 = ({ use: T = "span", ...props }: UseProps) => <T {...props} />;
  const UseBox1 = use(Box1);
  const UseBox2 = use(Box2);
  expect(getTreeJson(<UseBox1 use={UseBox2} />)).toMatchInlineSnapshot(`
<Box1
  use={ForwardRef}
  useNext={ForwardRef}
>
  <Box2>
    <span />
  </Box2>
</Box1>
`);
});

test("use component with use prop as multiple component", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const Box2 = ({ use: T = "span", ...props }: UseProps) => <T {...props} />;
  const Box3 = ({ use: T = "a", ...props }: UseProps) => <T {...props} />;
  const UseBox1 = use(Box1);
  expect(getTreeJson(<UseBox1 use={[Box2, Box3]} />)).toMatchInlineSnapshot(`
<Box1
  use={ForwardRef}
  useNext={
    Array [
      Box2,
      Box3,
    ]
  }
>
  <Box2
    use={ForwardRef}
    useNext={Box3}
  >
    <Box3>
      <a />
    </Box3>
  </Box2>
</Box1>
`);
});

test("use component with custom prop with use prop as multiple component", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps & { foo: string }) => (
    <T {...props} />
  );
  const Box2 = ({ use: T = "span", ...props }: UseProps & { bar: string }) => (
    <T {...props} />
  );
  const Box3 = ({ use: T = "a", ...props }: UseProps) => <T {...props} />;
  const UseBox1 = use(Box1);
  expect(getTreeJson(<UseBox1 use={[Box2, Box3]} foo="" bar="" />))
    .toMatchInlineSnapshot(`
<Box1
  bar=""
  foo=""
  use={ForwardRef}
  useNext={
    Array [
      Box2,
      Box3,
    ]
  }
>
  <Box2
    bar=""
    foo=""
    use={ForwardRef}
    useNext={Box3}
  >
    <Box3
      bar=""
      foo=""
    >
      <a
        bar=""
        foo=""
      />
    </Box3>
  </Box2>
</Box1>
`);
});

test("nested use", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const Box2 = ({ use: T = "span", ...props }: UseProps) => <T {...props} />;
  const UseBox1 = use(Box1);
  const UseBox1Box2 = use(UseBox1, Box2);
  expect(getTreeJson(<UseBox1Box2 />)).toMatchInlineSnapshot(`
<Box1
  use={ForwardRef}
  useNext={Box2}
>
  <Box2>
    <span />
  </Box2>
</Box1>
`);
});

test("nested use with custom prop", () => {
  const Box1 = ({ use: T = "div", ...props }: UseProps & { foo: string }) => (
    <T {...props} />
  );
  const Box2 = ({ use: T = "span", ...props }: UseProps) => <T {...props} />;
  const UseBox1 = use(Box1);
  const UseBox1Box2 = use(UseBox1, Box2);
  expect(getTreeJson(<UseBox1Box2 foo="" />)).toMatchInlineSnapshot(`
<Box1
  foo=""
  use={ForwardRef}
  useNext={Box2}
>
  <Box2
    foo=""
  >
    <span
      foo=""
    />
  </Box2>
</Box1>
`);
});

test("really nested use", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const UseBox = use(use(use(use(use(Box)))));
  expect(getTreeJson(<UseBox />)).toMatchInlineSnapshot(`
<Box>
  <div />
</Box>
`);
});

test("really nested use with use prop", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const UseBox = use(use(use(use(use(Box)))));
  expect(getTreeJson(<UseBox use="span" />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useNext="span"
>
  <span />
</Box>
`);
});

test("empty use", () => {
  const Empty = use();
  expect(getTreeJson(<Empty />)).toMatchInlineSnapshot(`null`);
});

test("string use", () => {
  const Div = use("div");
  expect(getTreeJson(<Div />)).toMatchInlineSnapshot(`<div />`);
});

test("string use with children", () => {
  const Div = use("div");
  expect(getTreeJson(<Div>Div</Div>)).toMatchInlineSnapshot(`
<div
  children="Div"
/>
`);
});

test("empty use with use prop", () => {
  const Empty = use();
  expect(getTreeJson(<Empty use="div" />)).toMatchInlineSnapshot(`<div />`);
});

test("empty uses after string use", () => {
  const Empty1 = use();
  const Empty2 = use();
  const Button = use("button");
  const ButtonEmpty1Empty2 = use(use(Button), Empty1, Empty2);
  expect(getTreeJson(<ButtonEmpty1Empty2 />)).toMatchInlineSnapshot(
    `<button />`
  );
});

test("empty uses after component use", () => {
  const Box = ({ use: T = "div", ...props }: UseProps) => <T {...props} />;
  const Button = use(Box, "button");
  const ButtonEmptyEmpty = use(Button, use(), use());
  expect(getTreeJson(<ButtonEmptyEmpty />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useNext={
    Array [
      "button",
      ForwardRef,
      ForwardRef,
    ]
  }
>
  <button />
</Box>
`);
});

test("empty custom component after two use components", () => {
  const Box = ({ use: T, ...props }: UseProps) => (T ? <T {...props} /> : null);
  const Div = use("div");
  const Button = use("button");
  const DivButtonBox = use(Div, Button, Box);
  expect(getTreeJson(<DivButtonBox />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useFallback="button"
>
  <button />
</Box>
`);
});

test("custom component with default use prop after two use components", () => {
  const Box = ({ use: T = "a", ...props }: UseProps) => <T {...props} />;
  const Div = use("div");
  const Button = use("button");
  const DivButtonBox = use(Div, Button, Box);
  expect(getTreeJson(<DivButtonBox />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useFallback="button"
>
  <button />
</Box>
`);
});

test("use prop with empty component after two use components", () => {
  const Box = ({ use: T, ...props }: UseProps) => (T ? <T {...props} /> : null);
  const Div = use("div");
  const Button = use("button");
  const DivButton = use(Div, Button);
  expect(getTreeJson(<DivButton use={Box} />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useFallback="button"
>
  <button />
</Box>
`);
});

test("use prop with string after two use components", () => {
  const Div = use("div");
  const Button = use("button");
  const DivButton = use(Div, Button);
  expect(getTreeJson(<DivButton use="span" />)).toMatchInlineSnapshot(
    `<span />`
  );
});

test("use prop with custom component with default use prop after two use components", () => {
  const Box = ({ use: T = "a", ...props }: UseProps) => <T {...props} />;
  const Div = use("div");
  const Button = use("button");
  const DivButton = use(Div, Button);
  expect(getTreeJson(<DivButton use={Box} />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useFallback="button"
>
  <button />
</Box>
`);
});

test("render the last use", () => {
  const Box = ({ use: T = "a", ...props }: UseProps) => <T {...props} />;
  const Div = use(Box, "div");
  const Button = use(Box, "button");
  const DivButton = use(Div, Button);
  expect(getTreeJson(<DivButton />)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  useNext={
    Array [
      "div",
      ForwardRef,
    ]
  }
>
  <Box
    use={ForwardRef}
    useNext="button"
  >
    <button />
  </Box>
</Box>
`);
});
