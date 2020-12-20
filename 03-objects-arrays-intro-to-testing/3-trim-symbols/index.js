/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }

  if (!size){
    return string;
  }

  const collector = [];
  let counter = 0;

  for (let i = 0; i < string.length; i++) {
    if (string[i] !== collector[collector.length - 1]) {
      counter = 1;
      collector.push(string[i]);
      continue;
    }
    if (string[i] === collector[collector.length - 1] && counter < size) {
      collector.push(string[i]);
      counter++;
      continue;
    }
  }

  return collector.join('');
}
