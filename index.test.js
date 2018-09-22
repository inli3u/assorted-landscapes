const {
  quicksort,
  isSorted,
  randomArray
} = require('./index.js');


test('isSorted', () => {
  // covers: positives ints, negatives, floating point, duplicate (equal) numbers.
  
  // It expects an array.
  expect(() => isSorted(5)).toThrow(TypeError);
  
  // It returns true for empty arrays.
  const empty = [];
  expect(isSorted(empty)).toBe(true);

  // It returns true for arrays with 1 item.
  const one = [1];
  expect(isSorted(one)).toBe(true);

  // It returns true for sorted arrays.
  const sorted = [-5, 0, 1, 1, 10, 10.1, 10.2];
  expect(isSorted(sorted)).toBe(true);

  // It returns false for unsorted arrays
  const unsorted = [5, 0, 1, 1, 10, 10.1, 10.2];
  expect(isSorted(unsorted)).toBe(false);
});

test('quicksort', () => {
  //let random = [4,8,5,2,8,4,7,5,9,2,5,80,6,0,23,56,34, -6, -10, -20, 100.2, 100.3, 0, -10000, 10000];
  let random = randomArray(10);
  let noop = () => null;

  // It sorts the array in-place
  quicksort(random, noop);
  if (isSorted(random) !== true) {
    throw new Error('Assertion failed: Quicksort.sort did not sort the array');
  }
});
