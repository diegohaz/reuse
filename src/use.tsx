/* eslint-disable no-param-reassign */
import * as React from "react";
import hoist from "hoist-non-react-statics";
import { UseProps, UseProp, UseComponent } from "./types";
import { omit, toArray } from "./utils";

const Use = React.forwardRef((props: UseProps<any>, ref) =>
  render(Object.assign(omit(props, "useNext"), { ref, use: props.useNext }))
);

function render(props: UseProps<any>) {
  let { useFallback } = props;
  const T = toArray(props.use).filter(x => x !== Use);

  // useFallback is used to make this
  // use(use("div"), use("span"), use())
  // render "span" instead of null
  // ["div", "span", Empty] -> [Empty] / useFallback = "span"
  while (typeof T[0] === "string") {
    useFallback = T.shift();
  }

  const [Component = useFallback, ...useNext] = T;

  if (!Component) {
    return null;
  }

  const finalProps = omit(props, "use", "useNext", "useFallback");

  if (typeof Component === "string") {
    return <Component {...finalProps} />;
  }

  if (!useNext.length) {
    return (
      <Component
        {...finalProps}
        use={useFallback ? Use : undefined}
        useFallback={useFallback}
      />
    );
  }

  if (useNext.length === 1) {
    return (
      <Component
        {...finalProps}
        use={Use}
        useNext={useNext[0]}
        useFallback={typeof useNext[0] !== "string" ? useFallback : undefined}
      />
    );
  }

  return (
    <Component
      {...props}
      use={Use}
      useNext={useNext}
      useFallback={useFallback}
    />
  );
}

function use<T extends UseProp[]>(...uses: T) {
  let Component = React.forwardRef((props, ref) =>
    render(
      Object.assign(omit(props, "useNext"), {
        ref,
        use: [...uses, ...toArray(props.use), ...toArray(props.useNext)]
      })
    )
  ) as UseComponent<T[number]>;

  uses.filter(item => item && typeof item !== "string").forEach(item => {
    Component = hoist(Component, item as Exclude<typeof item, string>);
  });

  return Component;
}

export default use;
