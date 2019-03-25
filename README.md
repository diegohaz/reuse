<br><br>

<p align="center">
  <img src="https://raw.githubusercontent.com/diegohaz/reuse/master/branding/logo.png" alt="reuse" height="200" />
</p>

<br>

<p align="center">
  Reuse different React components to create new ones<br>
  <a href="https://codesandbox.io/s/github/diegohaz/reuse/tree/master/examples/simple"><strong>Play on CodeSandbox</strong></a>
</p>

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/diegohaz/reuse/master/branding/graphic.png" height="350" />
</p>

<br>

<p align="center">
  <a href="https://npmjs.org/package/reuse"><img alt="NPM version" src="https://img.shields.io/npm/v/reuse.svg?style=flat-square" /></a>
  <a href="https://david-dm.org/diegohaz/reuse"><img alt="Dependencies" src="https://img.shields.io/david/diegohaz/reuse.svg?style=flat-square" /></a>
  <a href="https://travis-ci.org/diegohaz/reuse"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/reuse/master.svg?style=flat-square" /></a>
  <a href="https://codecov.io/gh/diegohaz/reuse/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/reuse/master.svg?style=flat-square" /></a>
</p>

## Installation

```sh
npm i reuse
```

> Thanks to [@eldargab](https://github.com/eldargab) for the package name on npm.

## Why

This enables **(sub)[atomic design](http://bradfrost.com/blog/post/atomic-web-design/)** approach.

When using classic CSS, we have a powerful way to compose "stylesheet components" by applying multiple class names to our HTML elements (`.btn`, `.large`, `.rounded` etc.). But, by doing that in React, which has its own component structure, we'll have conflicting component structures.

**Reuse** solves it by combining React components together as if they were CSS classes. This also means that not only style will be composed, but also JavaScript behavior, like React lifecycle methods and event handlers.

## Usage

Reuse simply exports a factory method that returns a React component. You can leverage that method in two ways: [augmentation](#augmentation) and [combination](#combination).

### Examples

- [Simple](https://codesandbox.io/s/github/diegohaz/reuse/tree/master/examples/simple)
- [PaperRoundedButton](https://codesandbox.io/s/github/diegohaz/reuse/tree/master/examples/paper-rounded-button)
- [Styled Components](https://codesandbox.io/s/github/diegohaz/reuse/tree/master/examples/styled-components)

### Augmentation

The component returned by the `use` factory will expect a `use` prop:

```jsx
import use from "reuse";

const Box = use();

<Box />; // null
<Box use="div" />; // <div />
<Box use={Link} />; // <Link />
```

You can create the component with a default element:

```jsx
const Box = use("div");

<Box />; // <div />
<Box use="span" />; // <span />
```

You can create the component with another component. **Just make sure to render the `use` prop as the underlying element and pass the other props down** (at least, when `use` isn't a string – HTML element):

```jsx
import React from "react";
import use from "reuse";

// grab the `use` prop and pass down other props
const Base = ({ use: T = "div", ...props }) => <T {...props} />;

const Box = use(Base);

<Box />; // <div />
<Box use="span" />; // <span />

const BoxSpan = use(Box, "span");
<BoxSpan />; // <span />
```

> You can use `Base` to filter custom props when `use` is a string using [@emotion/is-prop-valid](https://github.com/emotion-js/emotion/tree/master/next-packages/is-prop-valid), for example.

### Combination

Let's create some components:

```jsx

// Using styled-components
const Paper = styled(use("div"))`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.30);
`;

// Using class names
const Rounded = use(({ use: T, ...props }) => (
  <T
    {...props}
    className={`rounded ${props.className}`}
  />
), "div");

// Using inline styles
const Button = use(({ use: T, ...props }) => (
  <T
    {...props}
    style={{
      padding: "0 1em",
      lineHeight: "2.5em",
      background: "#3f51b5",
      color: "white",
      ...props.style
    }}
  />
), "button");
```

Once you have a few of those components, you can combine them using the same `use` methods:

```jsx
import use from "reuse";
import { Rounded, Paper, Button } from "../components";

// with factory
const RoundedPaperButton = use(Rounded, Paper, Button);
<RoundedPaperButton />; // <button style="..." class="..." />
<RoundedPaperButton use="div" />; // <div style="..." class="..." />

// with prop
<Rounded use={[Paper, Button]} /> // <button style="..." class="..." />
<Rounded use={[Paper, Button, "div"]} /> // <div style="..." class="..." />
```

Note that the underlying HTML element will always be based on the last component you pass to `use`.

## FAQ

<details>
<summary><strong>How does this compare to render props and HOCs?</strong></summary>

These are equivalent implementations:

**Render props**
```jsx
<Paper>
  {paperProps => (
    <Rounded {...paperProps}>
      {roundedProps => (
        <Button {...roundedProps}>
          {buttonProps => (
            <button {...buttonProps}>Button</button>
          )}
        </Button>
      )}
    </Rounded>
  )}
</Paper>
```

**High-order components**
```jsx
withPaper(withRounded(withButton(props => <button {...props}>Button</button>)));
```

**Reuse**
```jsx
use(Paper, Rounded, Button);
// or
<Paper use={[Rounded, Button]} />
```

When using render props or HOCs, you have to stick with their static (HOC) or dynamic implementation (render prop). With Reuse, besides simplicity, you can use both depending on your needs.

</details>


## License

MIT © [Haz](https://github.com/diegohaz)
