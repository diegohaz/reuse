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

type UseProps = { use?: React.ReactType };

const Box: React.SFC<UseProps> = ({ use: T = "div", ...props }) => (
  <T {...props} />
);

test("simple component", () => {
  const UseBox = use(Box);
  const node = <UseBox />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box>
  <div />
</Box>
`);
});

test("different underlying element", () => {
  const BoxSpan = use(Box, "span");
  const node = <BoxSpan />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use="span"
>
  <span />
</Box>
`);
});

test("simple component with static use method", () => {
  const UseBox = use(Box);
  const UseBoxSpan = UseBox.use("span");
  const node = <UseBoxSpan />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use="span"
>
  <span />
</Box>
`);
});

test("two different components", () => {
  const Other: React.SFC<UseProps> = ({ use: T = "span", ...props }) => (
    <T {...props} />
  );
  const BoxOther = use(Box, Other);
  const node = <BoxOther />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use={Other}
>
  <Other>
    <span />
  </Other>
</Box>
`);
});

test("two different components rendering the same", () => {
  const Other1: React.SFC = props => <Box {...props} />;
  const Other2: React.SFC = props => <Box {...props} />;
  const Other1Other2 = use(Other1, Other2);
  const node = <Other1Other2 />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Other1
  use={Other2}
>
  <Box
    use={Other2}
  >
    <Other2>
      <Box>
        <div />
      </Box>
    </Other2>
  </Box>
</Other1>
`);
});

test("two components and a different underlying element", () => {
  const Other: React.SFC<UseProps> = ({ use: T = "span", ...props }) => (
    <T {...props} />
  );
  const BoxOtherA = use(Box, Other, "a");
  const node = <BoxOtherA />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  uses={
    Array [
      Other,
      "a",
    ]
  }
>
  <Other
    use="a"
  >
    <a />
  </Other>
</Box>
`);
});

test("simple component with prop", () => {
  const Other: React.SFC<{ foo: string }> = props => <Box {...props} />;
  const UseOther = use(Other);
  const node = <UseOther foo="" />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Other
  foo=""
>
  <Box
    foo=""
  >
    <div
      foo=""
    />
  </Box>
</Other>
`);
});

test("two different components with custom props", () => {
  const Other1: React.SFC<UseProps & { foo: string }> = ({
    use: T = "span",
    ...props
  }) => <T {...props} />;
  const Other2: React.SFC<UseProps & { bar: string }> = ({
    use: T = "span",
    ...props
  }) => <T {...props} />;
  const Other1Other2 = use(Other1, Other2);
  const node = <Other1Other2 foo="" bar="" />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Other1
  bar=""
  foo=""
  use={Other2}
>
  <Other2
    bar=""
    foo=""
  >
    <span
      bar=""
      foo=""
    />
  </Other2>
</Other1>
`);
});

test("simple component with use prop", () => {
  const UseBox = use(Box);
  const node = <UseBox use="span" />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use="span"
>
  <span />
</Box>
`);
});

test("simple component with same use prop", () => {
  const UseBox = use(Box);
  const node = <UseBox use="div" />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use="div"
>
  <div />
</Box>
`);
});

test("two different components with custom props and use prop", () => {
  const Other1: React.SFC<UseProps & { foo: string }> = ({
    use: T = "span",
    ...props
  }) => <T {...props} />;
  const Other2: React.SFC<UseProps & { bar: string }> = ({
    use: T = "span",
    ...props
  }) => <T {...props} />;
  const Other1Other2 = use(Other1, Other2);
  const node = <Other1Other2 use="div" foo="" bar="" />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Other1
  bar=""
  foo=""
  use={ForwardRef}
  uses={
    Array [
      Other2,
      "div",
    ]
  }
>
  <Other2
    bar=""
    foo=""
    use="div"
  >
    <div
      bar=""
      foo=""
    />
  </Other2>
</Other1>
`);
});

test("simple component with use prop as component", () => {
  const Other: React.SFC<UseProps> = ({ use: T = "span", ...props }) => (
    <T {...props} />
  );
  const UseBox = use(Box);
  const node = <UseBox use={Other} />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use={Other}
>
  <Other>
    <span />
  </Other>
</Box>
`);
});

test("simple component with use prop as multiple component", () => {
  const Other: React.SFC<UseProps & { foo: string }> = ({
    use: T = "span",
    ...props
  }) => <T {...props} />;
  const UseBox = use(Box);
  const node = <UseBox use={[Other, "a"]} foo="" />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  foo=""
  use={ForwardRef}
  uses={
    Array [
      Other,
      "a",
    ]
  }
>
  <Other
    foo=""
    use="a"
  >
    <a
      foo=""
    />
  </Other>
</Box>
`);
});

test("nested use", () => {
  const Other: React.SFC<UseProps & { foo: string }> = ({
    use: T = "span",
    ...props
  }) => <T {...props} />;
  const UseOther = use(Other);
  const UseOtherBox = use(UseOther, Box);
  const node = <UseOtherBox foo="" />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Other
  foo=""
  use={Box}
>
  <Box
    foo=""
  >
    <div
      foo=""
    />
  </Box>
</Other>
`);
});

test("nested repeating component", () => {
  const UseBox = use(use(use(Box)));
  const node = <UseBox />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box>
  <div />
</Box>
`);
});

test("intersecting components", () => {
  const Other1: React.SFC<UseProps> = ({ use: T = "span", ...props }) => (
    <T {...props} />
  );
  const Other2: React.SFC<UseProps> = ({ use: T = "span", ...props }) => (
    <T {...props} />
  );
  const BoxOther1 = use(Box, Other1);
  // repeating Other1
  const BoxOther1Other1Other2 = use(BoxOther1, Other1, Other2);
  const node = <BoxOther1Other1Other2 />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`
<Box
  use={ForwardRef}
  uses={
    Array [
      Other1,
      Other1,
      Other2,
    ]
  }
>
  <Other1
    use={ForwardRef}
    uses={
      Array [
        Other1,
        Other2,
      ]
    }
  >
    <Other1
      use={Other2}
    >
      <Other2>
        <span />
      </Other2>
    </Other1>
  </Other1>
</Box>
`);
});

test("empty use", () => {
  const Use = use();
  const node = <Use />;
  expect(getTreeJson(node)).toMatchInlineSnapshot(`null`);
});
