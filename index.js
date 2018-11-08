'use strict';

let mouseX = 0;
let rows = [];

function main() {
  document.addEventListener('DOMContentLoaded', function () {
    generate();
    document.body.addEventListener('click', (e) => generate());
    document.body.addEventListener('keypress', (e) => generate());
    document.body.addEventListener('mousemove', (e) => {
      mouseX = e.pageX;
      draw();
    });
  });
}

function generate() {
  let random = randomArray(20);

  rows = [copyArray(random)];
  quicksort(random, (list) => rows.push(list));

  // rows = [copyArray(random), ...mergesortBU(random)];
  // rows = sample(rows, 20);

  draw();
}

function draw() {
  let canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  let ctx = canvas.getContext('2d');

  let lines = pointsFromRows(rows, canvas.width, canvas.height);

  let distance = mouseX * 2 - window.innerWidth;
  console.log(distance);
  //let linesParallax = parallax(lines, distance, 1);
  let linesParallax = lines; //parallaxPerspective(lines, distance, canvas.width);

  drawFilled2(ctx, linesParallax, makeBezierPath);
}

/**
 * Given an array, return a new array containing at most max items evenly distributed across the original array
*/
function sample(array, max) {
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


/**
 * Renderer
 */

function drawStroked(ctx, all, pathFunc) {
  for (let i = 0; i < all.length; i++) {
    let row = all[i];

    pathFunc(ctx, row);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = i / all.length * 4 + 2;
    ctx.stroke();
  }
}

function drawFilled1(ctx, all, pathFunc) {
  let canvas = document.querySelector('canvas');
  let c = 30;
  ctx.fillStyle = rgba(c, c, c, 1);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < all.length; i++) {
    let row = all[i];

    pathFunc(ctx, row);
    closePath(row, ctx, canvas.width, canvas.height);

    let depth = i / all.length;
    let color = ((depth) * 0.7 + 0.2) * 255; // values from 0.2 to 0.95, dark gray to off white
    ctx.fillStyle = rgba(color, color, color, 1);
    ctx.fill();
  }
}

function drawFilled2(ctx, all, pathFunc) {
  let canvas = document.querySelector('canvas');
  let c = 200;
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < all.length; i++) {
    let row = all[i];

    pathFunc(ctx, row);
    closePath(row, ctx, canvas.width, canvas.height);

    let depth = i / all.length;
    let color = 255;
    ctx.fillStyle = rgba(color, color, color, 1);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = i / all.length * 2 * window.devicePixelRatio + 2;
    ctx.stroke();
  }

  // let color = 230;
  // ctx.fillStyle = rgba(color, color, color, 1);
  // ctx.fill();
}

function pointsFromRows(rows, canvasWidth, canvasHeight) {
  // 2 = 3 / 4
  // 3 = 4 / 6
  let rowHeight = (rows.length + 1) / (rows.length * 2) * canvasHeight;

  return rows.map((row, rowIndex) => {
    const stepX = canvasWidth / (row.length - 1);

    // 2 = 1 / 4
    // 3 = 1 / 6
    let rowOffsetY = rowIndex / (rows.length * 2) * canvasHeight;

    return row.map((value, i) => {
      let pointOffsetY = rowHeight * (1 - value);

      return {
        x: i * stepX,
        y: pointOffsetY + rowOffsetY
      };
    });
  });
}

function parallax(lines, distance, strength) {
  return lines.map((line, lineI) => {
    let s = lineI / (lines.length - 1) * strength;
    return line.map((point) => {
      return {
        x: point.x + distance + distance * s,
        y: point.y
      }
    });
  });
}

function parallaxPerspective(lines, camerax, canvasWidth) {
  return lines.map((line, lineI) => {
    //let 
    let distance = 12 / ((lines.length - lineI) / 2 + 12) //* 0.02;
    return line.map((point) => {
      return {
        x: (point.x - canvasWidth / 2 + camerax) * distance + canvasWidth / 2 ,
        y: point.y
      }
    });
  });
}

function makeBezierPath(ctx, row) {
  let px = row[0].x;
  let py = row[0].y;

  ctx.beginPath();
  ctx.moveTo(row[0].x, row[0].y);

  for (let i = 1; i < row.length; i++) {
    let nx = row[i].x;
    let ny = row[i].y;
    let c1x = (px + nx) / 2;
    let c1y = py;
    let c2x = (px + nx) / 2;
    let c2y = ny;

    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, nx, ny);

    px = nx;
    py = ny;
  }
}

function makeLinearPath(ctx, row) {
  ctx.beginPath();
  ctx.moveTo(row[0].x, row[0].y);

  for (let i = 1; i < row.length; i++) {
    ctx.lineTo(row[i].x, row[i].y);
  }
}

function closePath(line, ctx, width, height) {
  ctx.lineTo(line[line.length - 1].x, height);
  ctx.lineTo(line[0].x, height);
  ctx.closePath();
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



/**
 * Helpers
 */

function copyArray(a) {
  return a.slice();
}

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
  for (let i = 0; i < len; i++) {
    a.push(Math.random());
  }
  return a;
}

// Exports for runnning tests
if (typeof exports !== 'undefined') {
  exports.randomArray = randomArray;
  exports.isSorted = isSorted;
  exports.quicksort = quicksort;
  exports.merge = merge;
  exports.mergesortBU = mergesortBU;
}