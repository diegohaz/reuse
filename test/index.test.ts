import sayHello from "../src";

test("sayHello", () => {
  expect(sayHello()).toBe("Hello, Haz!");
  expect(sayHello("foo")).toBe("Hello, foo!");
});
