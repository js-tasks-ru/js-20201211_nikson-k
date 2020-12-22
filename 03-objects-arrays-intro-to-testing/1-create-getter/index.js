/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const tokens = path.split('.');
  return (obj) => {
    let result = { ...obj };
    let i = 0;
    while (i < tokens.length) {
      if (!result[tokens[i]]) {
        return undefined;
      }
      result = result[tokens[i]];
      i++;
    }

    return result;
  }
}
