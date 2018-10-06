'use strict';

function main() {
  document.addEventListener('DOMContentLoaded', function () {
    generate();
    document.body.addEventListener('click', (e) => generate());
    document.body.addEventListener('keypress', (e) => generate());
  });
}

function generate() {
  let canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  let ctx = canvas.getContext('2d');


  let random = randomArray(20);
  let rows = [];
  quicksort(random, (list) => rows.push(list));
  //renderFilled(rows);
  let transformed = rows.map((row, i) => pointsFromRow(row, rows.length, i, canvas.width, canvas.height));

  //drawStroked(ctx, transformed, makeLinearPath);
  //drawStroked(ctx, transformed, makeBezierPath);
  drawFilled2(ctx, transformed, makeBezierPath);
  //drawFilled1(ctx, transformed, makeBezierPath);

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
    closePath(ctx, canvas.width, canvas.height);

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
    closePath(ctx, canvas.width, canvas.height);

    let depth = i / all.length;
    let color = 255;
    ctx.fillStyle = rgba(color, color, color, 1);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = i / all.length * 4 + 2;
    ctx.stroke();
  }

  // let color = 230;
  // ctx.fillStyle = rgba(color, color, color, 1);
  // ctx.fill();
}

function pointsFromRow(row, rowsLength, y, width, height) {
  const stepX = width / (row.length - 1);
  const stepY = stepX * 5;
  const yspace = (height - stepY) / rowsLength;
  let offsetY = y * yspace;

  return row.map((v, i) => {
    let nx = i * stepX;
    let ny = offsetY + (1 - v) * stepY;
    return {x: nx, y: ny};
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

function closePath(ctx, width, height) {
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
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
}