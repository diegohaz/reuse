/* eslint-disable no-param-reassign */
import * as React from "react";
import hoist from "hoist-non-react-statics";
import { UseProps, UseProp, UseComponent } from "./types";
import { omit, parseUse, toArray } from "./utils";

const Use = React.forwardRef((props: UseProps<any>, ref) =>
  render(Object.assign(omit(props, "uses"), { ref, use: props.uses }))
);

function render(props: UseProps<any>) {
  const T = parseUse(props.use);
  const [First, ...uses] = T.filter(x => x !== Use);
  if (!First) {
    return null;
  }
  if (!uses.length) {
    return <First {...omit(props, "use")} />;
  }
  if (uses.length === 1) {
    return <First {...props} use={uses[0]} />;
  }
  // We can't pass array to `use`, so we pass `Use`, which handles `uses` array
  return <First {...props} use={Use} uses={uses} />;
}

function use<T extends UseProp[]>(...uses: T) {
  let Component = React.forwardRef((props, ref) =>
    render(
      Object.assign(omit(props, "uses"), {
        ref,
        use: [...uses, ...toArray(props.use), ...toArray(props.uses)]
      })
    )
  ) as UseComponent<T[number]>;

  uses.filter(item => item && typeof item !== "string").forEach(item => {
    Component = hoist(Component, item as Exclude<typeof item, string>);
  });

  return Component;
}

export default use;
