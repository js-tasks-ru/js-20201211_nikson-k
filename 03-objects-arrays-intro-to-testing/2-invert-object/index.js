/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (!obj) {
    return undefined;
  }

  const result = {};
  Object.entries(obj).forEach(e => {
    result[e[1]] = e[0];
  });

  return result;
}
