/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  if (!arr) {
    return [];
  }

  let map = new Map();
  arr.forEach(e => {
    if (!map.has(e)) {
      map.set(e, 1);
    }
  });

  return Array.from(map.keys());
}
