'use strict';

import {sample} from './ArrayUtil';


/*** Drawing functions ***/

function draw(sortLog, steps, scale) {
  let canvas = document.querySelector('canvas');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  let ctx = canvas.getContext('2d');

  let lines = pointsFromRows(sample(sortLog, steps), scale, canvas.width, canvas.height);

  //let distance = mouseX * 2 - window.innerWidth;
  //let linesParallax = parallax(lines, distance, 1);
  let linesParallax = lines; //parallaxPerspective(lines, distance, canvas.width);

  drawFilledFlat(ctx, linesParallax, makeBezierPath);
}

function drawStroked(ctx, all, pathFunc) {
  for (let i = 0; i < all.length; i++) {
    let row = all[i];

    pathFunc(ctx, row);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = i / all.length * 4 + 2;
    ctx.stroke();
  }
}

function drawFilledDepth(ctx, all, pathFunc) {
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

function drawFilledFlat(ctx, all, pathFunc) {
  const colorBg = 230;
  const colorFg = 255;
  const canvas = document.querySelector('canvas');

  ctx.fillStyle = rgba(colorBg, colorBg, colorBg, 1);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = rgba(colorFg, colorFg, colorFg, 1);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';

  for (let i = 0; i < all.length; i++) {
    let row = all[i];
    pathFunc(ctx, row);
    closePath(row, ctx, canvas.width, canvas.height);
    ctx.fill();
    ctx.lineWidth = i / all.length * 2 * window.devicePixelRatio + 2;
    ctx.stroke();
  }

  // let color = 230;
  // ctx.fillStyle = rgba(color, color, color, 1);
  // ctx.fill();
}

function pointsFromRows(rows, scale, canvasWidth, canvasHeight) {
  // 2 = 3 / 4
  // 3 = 4 / 6
  let rowHeight = (rows.length + 1) / (rows.length * 2) * canvasHeight;

  return rows.map((row, rowIndex) => {
    const stepX = canvasWidth / (row.length - 1);

    // 2 = 1 / 4
    // 3 = 1 / 6
    let rowOffsetY = rowIndex / (rows.length * 2) * canvasHeight;

    return row.map((value, i) => {
      // 50%:  .25, .5, .75
      // 100%: 0,   .5, 1
      //let v = value * scale + value * ((1 - scale) / 2);
      let v = (value - 0.5) * scale + 0.5;
      let pointOffsetY = rowHeight * (1 - v);
      //pointOffsetY = pointOffsetY * scale + pointOffsetY * (scale / 2);

      return {
        x: i * stepX,
        y: pointOffsetY + rowOffsetY
      };
    });
  });
}

function pointsFromRowsEven(rows, canvasWidth, canvasHeight) {
  // Height of first rowOffsetY, doubled
  // 2 = 3 / 4
  // 3 = 4 / 6
  let rowHeight = 1 / (rows.length + 1) * 4 * canvasHeight;
  console.log(rowHeight);

  return rows.map((row, rowIndex) => {
    const stepX = canvasWidth / (row.length - 1);

    // 2 = 1 / 3, 2 / 3
    // 3 = 1 / 4, 2 / 4, 3 / 4
    let rowOffsetY = (rowIndex + 1) / (rows.length + 1) * canvasHeight;
    if (rowIndex == 0) console.log(rowOffsetY);

    return row.map((value, i) => {
      let pointOffsetY = rowHeight * (1 - value) - (rowHeight / 2);

      return {
        x: i * stepX,
        y: rowOffsetY + pointOffsetY
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



export default {
  draw
};