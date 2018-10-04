'use strict';

function main() {
  let random = randomArray(20);
  let rows = [];
  quicksort(random, (list) => rows.push(list));
  renderFilled(rows);
}



/**
 * Renderer
 */

function renderStroked(rows) {
  let canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  let ctx = canvas.getContext('2d');

  const xsize = canvas.width / (rows[0].length - 1);
  const ysize = xsize * 5;
  const yspace = (canvas.height - ysize) / rows.length;

  for (let y = 0; y < rows.length; y++) {
    let row = rows[y];

    let v = (1 - row[0] / 100) * ysize;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = y / rows.length * 4 + 2;
    ctx.beginPath();
    ctx.moveTo(0 * xsize, y * yspace + v);
    for (let x = 1; x < row.length; x++) {
      let v = (1 - row[x] / 100) * ysize;
      ctx.lineTo(x * xsize, y * yspace + v);
    }
    ctx.stroke();
  }
}


function renderFilled(rows) {
  let canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  let ctx = canvas.getContext('2d');


  let c = 30;
  ctx.fillStyle = rgba(c, c, c, 1);
  //ctx.fillStyle = rgba(255, 255, 255, 1);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const xsize = canvas.width / (rows[0].length - 1);
  const ysize = xsize * 5;
  const yspace = (canvas.height - ysize) / rows.length;

  for (let y = 0; y < rows.length; y++) {
    let row = rows[y];

    let v = (1 - row[0] / 100) * ysize;
    let depth = y / rows.length;
    
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0 * xsize, y * yspace + v);

    for (let x = 1; x < row.length; x++) {
      let v = (1 - row[x] / 100) * ysize;
      ctx.lineTo(x * xsize, y * yspace + v);
    }

    ctx.closePath();

    let color = ((depth) * 0.5 + 0.25) * 255;
    ctx.fillStyle = rgba(color, color, color, 1);
    ctx.fill();
  }
}

function rgba(r, g, b, a) {
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}




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
 * Helpers
 */

function isSorted(list) {
  if (!Array.isArray(list)) throw new TypeError('First argument must be an array');

  for (let i = 0; i < list.length - 1; i++) {
    if (list[i] > list[i + 1]) {
      return false;
    }
  }

  return true;  
}

function randomArray(len) {
  let a = [];
  let min = 0;
  let max = 100;
  for (let i = 0; i < len; i++) {
    a.push(Math.round(Math.random() * max));
  }
  return a;
}

// Exports for runnning tests
if (typeof exports !== 'undefined') {
  exports.randomArray = randomArray;
  exports.isSorted = isSorted;
  exports.quicksort = quicksort;
}