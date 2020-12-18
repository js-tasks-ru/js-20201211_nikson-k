/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCpy = [...arr];
  const mode = param.toLowerCase() === 'asc' ? 1 : -1;

  return arrCpy.sort((a, b) => a.localeCompare(b, 'ru-en', { caseFirst: 'upper', localeMatcher: 'best fit' }) * mode);
}
