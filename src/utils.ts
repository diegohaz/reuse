import { Omit, Dictionary } from "./types";

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
