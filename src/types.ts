import * as React from "react";

export type Dictionary<T = any> = { [key: string]: T };

/**
 * @template T Object
 * @template K Union of T keys
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * @template T Object
 * @template K Union of keys (not necessarily present in T)
 */
export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * Transform `"a" | "b"` into `"a" & "b"`
 * @template U Union
 */
export type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

/**
 * Get component props
 * @template T Component type
 */
export type ComponentToProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;

/**
 * Use prop
 * @template P Props type
 */
export type UseProp<P = any> =
  | keyof JSX.IntrinsicElements
  | React.ComponentType<P>;

/**
 * Remove use props from object `T` if they're present
 * @template T Object
 */
export type WithoutUseProps<T> = Without<T, "use" | "useNext">;

/**
 * Grab components passed to the `use` prop and return their props
 * @template T Component type
 */
export type InheritedProps<T> = WithoutUseProps<
  UnionToIntersection<ComponentToProps<T>>
>;

/**
 * Props of a component created with `use()`
 * @template T The type of the `use` prop
 */
export type UseProps<T> = React.Props<any> &
  InheritedProps<T> & {
    readonly use?: T | T[];
    readonly useNext?: T | T[];
  };

/**
 * Component created with `use()`
 * @template T Component type passed to `use(...components)`
 */
export type UseComponent<T> = {
  <TT>(props: InheritedProps<T> & UseProps<TT>): JSX.Element;
  uses: T[];
};
