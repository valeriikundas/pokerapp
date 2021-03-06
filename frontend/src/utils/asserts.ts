import { AssertionError } from "assert";

/**
 * Assert condition
 *
 * @param {any} condition
 * @param {string} msg
 */
export function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError({ message: msg });
  }
}
