import * as React from "react";
import renderer, {
  ReactTestRendererTree,
  ReactTestRendererJSON
} from "react-test-renderer";

export function treeToJson(
  tree: ReactTestRendererTree | null
): null | ReactTestRendererJSON {
  if (!tree) return null;
  const { type, rendered, props } = tree;
  let children = null;
  if (rendered && !Array.isArray(rendered)) {
    const childrenJson = treeToJson(rendered);
    children = childrenJson ? [childrenJson] : null;
  }
  const json = {
    // @ts-ignore
    type: type.displayName || type.name || type,
    props,
    children
  };
  Object.defineProperty(json, "$$typeof", {
    value: Symbol.for("react.test.json")
  });
  return json;
}

export function getTreeJson(node: React.ReactElement<any>) {
  const wrapper = renderer.create(node);
  return treeToJson(wrapper.toTree());
}
