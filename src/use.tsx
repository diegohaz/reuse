/* eslint-disable no-param-reassign */
import * as React from "react";
import { UseProps, UseProp, UseComponent } from "./types";
import { omit, toArray, arrayContainsArray } from "./utils";

const Use = React.forwardRef((props: UseProps<any>, ref) =>
  render(Object.assign(omit(props, "useNext"), { ref, use: props.useNext }))
);

function render(props: UseProps<any>) {
  // filter Use and string components in the middle
  const [Component, ...useNext] = toArray(props.use).filter(
    (x, i, arr) => x !== Use && (typeof x !== "string" || i === arr.length - 1)
  );

  if (!Component) {
    return null;
  }

  const finalProps = omit(props, "use", "useNext");

  if (!useNext.length || typeof Component === "string") {
    return <Component {...finalProps} />;
  }

  if (useNext.length === 1) {
    return <Component {...finalProps} use={useNext[0]} />;
  }

  return <Component {...props} use={Use} useNext={useNext} />;
}

function isUseComponent<T extends UseProp[]>(
  component?: any
): component is UseComponent<T[number]> {
  return component && Array.isArray(component.uses);
}

function use<T extends UseProp[]>(...uses: T) {
  const [First, ...next] = uses;

  if (isUseComponent(First) && arrayContainsArray(First.uses, next)) {
    return First;
  }

  const Component = React.forwardRef((props, ref) =>
    render(
      Object.assign(omit(props, "useNext"), {
        ref,
        use: [...uses, ...toArray(props.use), ...toArray(props.useNext)]
      })
    )
  ) as UseComponent<T[number]>;

  Component.uses = uses;

  return Component;
}

export default use;
