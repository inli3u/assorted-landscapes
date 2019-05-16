
/**
 * Quicksort
 */

function quicksort(list, callback) {
  if (!Array.isArray(list)) throw new TypeError('First argument must be an array');
  if (typeof callback !== 'function') throw new TypeError('Second argument must be a function');

  callback(list.slice());
  quicksortRange(list, 0, list.length - 1, callback);
}

function quicksortRange(list, low, high, callback) {
  if (low >= high) return;

  let p = partition(list, low, high, callback);
  quicksortRange(list, low, p - 1, callback);
  quicksortRange(list, p + 1, high, callback);
}

function partition(list, low, high, callback) {
  // partition into list[low...j-1], list[j], list[j+1...high]
  let pivot = list[low];
  let i = low;
  let j = high + 1;
  while (true) {
    do {
      ++i;
      if (i == high) break;
    } while (list[i] < pivot);

    do {
      --j;
      if (j == low) break;
    } while (list[j] > pivot);

    if (i >= j) {
      break;
    }

    swap(list, i, j);
    callback(list.slice());
  }

  swap(list, low, j);
  callback(list.slice());
  
  return j;
}

function swap(list, firstIndex, secondIndex) {
  let temp = list[firstIndex];
  list[firstIndex] = list[secondIndex];
  list[secondIndex] = temp;
}


/**
 * Mergesort
 */

function *mergesortBU(list) {
  let n = list.length;
  for (let size = 1; size < n; size += size) {
    for (let low = 0; low < n - size; low += size + size) {
      yield* merge(list, low, low + size - 1, Math.min(low + size + size - 1, n - 1));
    }
  }
}

function *merge(list, low, mid, high) {
  let i = low;
  let j = mid + 1;
  let aux = copyArray(list);

  for (let k = low; k <= high; k++) {
    if      (i > mid)         list[k] = aux[j++];
    else if (j > high)        list[k] = aux[i++];
    else if (aux[j] < aux[i]) list[k] = aux[j++];
    else                      list[k] = aux[i++];

    yield copyArray(list);
  }
}



/*** Array functions ***/

export function copyArray(a) {
  return a.slice();
}

export function randomArray(len) {
  let a = [];
  for (let i = 0; i < len; i++) {
    a.push(Math.random());
  }
  return a;
}

export function resizeEnd(array, targetSize) {
  if (targetSize < array.length) {
    return array.slice(0, targetSize - 1);
  }
  
  if (targetSize > array.length) {
    return array.concat(randomArray(targetSize - array.length));
  }

  // No change
  return copyArray(array);
}

export function resizeRandom(array, targetSize) {
  if (targetSize == array.length) return array;

  let copy = copyArray(array);

  while (targetSize < copy.length) {
    let randomIndex = Math.round(Math.random() * (targetSize - 1));
    copy.splice(randomIndex, 1);
  }
  
  while (targetSize > copy.length) {
    let randomIndex = Math.round(Math.random() * (targetSize - 1));
    copy.splice(randomIndex, 0, Math.random());
  }

  return copy;
}

export function resizeMid(array, targetSize) {
  if (targetSize == array.length) return array;

  let copy = copyArray(array);

  while (targetSize < copy.length) {
    let randomIndex = Math.round((targetSize - 1) / 2);
    copy.splice(randomIndex, 1);
  }
  
  while (targetSize > copy.length) {
    let randomIndex = Math.round((targetSize - 1) / 2);
    copy.splice(randomIndex, 0, Math.random());
  }

  return copy;
}

export function sortArray(array, algo) {
  let log = [];

  if (algo === 'quicksort') {
    // quicksort function reports original array first.
    quicksort(copyArray(array), (list) => log.push(list));
  } else {
    log = [copyArray(array), ...mergesortBU(copyArray(array))];
  }

  return log;
}

/**
 * Given an array, return a new array containing at most max items evenly distributed across the original array
*/
export function sample(array, max) {
  if (max <= 0) return [];
  if (max >= array.length) return array;

  let result = [];
  for (let n = 0; n < max - 1; n++) {
    let i = Math.round(n / max * array.length);
    result.push(array[i]);
  }

  // Always include last result.
  result.push(array[array.length - 1]);

  return result;
}

export function isSorted(list) {
  if (!Array.isArray(list)) throw new TypeError('First argument must be an array');

  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] > list[i + 1]) {
      return false;
    }
  }

  return true;
}



export default {
  resizeEnd,
  resizeRandom,
  resizeMid,
  sortArray
};