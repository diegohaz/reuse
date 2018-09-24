import { Omit, Dictionary, UseProp } from "./types";

export function omit<P extends Dictionary, K extends keyof P>(
  object: P,
  ...paths: K[]
) {
  const keys = Object.keys(object);
  const result = {} as Omit<P, K>;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (paths.indexOf(key as K) === -1) {
      result[key] = object[key];
    }
  }

  return result;
}

export function toArray<T>(arg?: T | T[]) {
  if (typeof arg === "undefined") return [];
  return Array.isArray(arg) ? arg : [arg];
}

export function parseUse(tag?: UseProp | UseProp[] | null) {
  // istanbul ignore else
  if (Array.isArray(tag)) {
    // put the last string at the end of the array
    const strings = tag.filter(x => typeof x === "string");
    const components = tag.filter(x => typeof x !== "string");
    if (strings.length) {
      return [...components, strings[strings.length - 1]];
    }
    return components;
  }
  // istanbul ignore next
  return toArray(tag);
}
