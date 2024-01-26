var W, M, c, C, WW, WH, CW, CH,
    options, radian, num, colors,
    animationId;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var makeCanvas = function () {
  document
    .getElementsByTagName("body")[0]
    .appendChild(document.createElement("canvas"));
};

var initialize = function () {
  W = window;
  M = Math;
  c = document.getElementsByTagName("canvas")[0];
  C = c.getContext("2d");
  WW = c.width = 500;
  WH = c.height = 500;
  WD = M.sqrt(WW * WW + WH * WH);
  CW = WW / 2;
  CH = WH / 2;
  CD = WD / 2;
  num = 2;
  colors = ['#563672', '#8D3D77', '#C6427A', '#FD497F'];
  radian = Math.PI * 2 / 6;
  options = getOptions();
  c.style.background = 'white';
};

var getOptions = function () {
  var arr = new Array();
  var scale = 50;
  var yNum = Math.floor(WH / scale) + 3;
  var xNum = Math.floor(WW / scale) + 1;
  var gapY = M.cos(30 * M.PI / 180) * scale;
  var gapX = scale / 2;
  
  for (var y = 0; y < yNum; y++) {
    for (var x = 0; x < xNum; x++) {
      var ny = y * gapY;
      var nx = x * scale;
      var atan = M.atan2(ny, nx);
      var dx, dy, dist;
      
      /** [x, y, radius, dist, atan] */
      if (y % 2 === 0) {
        dx = CW - nx;
        dy = CH - ny;
        dist = M.sqrt(dx * dx + dy * dy) / CD * 1.5;
        arr.push([nx, ny, scale, dist, atan, colors[getRandomNumber(0, colors.length - 1)]]);
      } else {
        var nnx = nx + gapX;
        dx = CW - nnx;
        dy = CH - ny;
        dist = M.sqrt(dx * dx + dy * dy) / CD * 1.5;
        arr.push([nnx, ny, scale, dist, atan]);
      }
    }
  }
  
  return arr;
};

var f = function (t) {
  t /= 1000;
  C.save();
  //C.fillStyle = 'rgba(0, 0, 0, 0.2)';
  //C.fillRect(0, 0, WW, WH);
  C.clearRect(0, 0, WW, WH);
  C.strokeStyle = 'white';
  C.lineWidth = 2;
  for (var i = 0; i < options.length; i++) {
    var amp;
    amp = M.tan(options[i][3] + t / 5) * (M.sin(t / 5) * 100);
    C.fillStyle = 'hsl(' + 360 * (amp * 0.005) + ', 80%, 80%)';
    var x = options[i][0];
    var y = options[i][1] + amp;
    var r = options[i][2];
    
    for (var j = 0; j < 6; j++) {
      C.save();
      C.translate(x, y);
      C.rotate(90 * M.PI / 180);
      C.translate(-x, -y);
      var nx = M.cos(radian * j) * r + x;
      var ny = M.sin(radian * j) * r + y;
      if (j === 0) {
        C.beginPath();
        C.moveTo(nx, ny);
      } else {
        C.lineTo(nx, ny);
        if (j === 5) {
          C.closePath();
          C.fill();
          C.stroke();
          
          /** line to center */
          for (var k = 0; k < 6; k += 2) {
            C.beginPath();
            C.moveTo(M.cos(radian * k) * r + x, M.sin(radian * k) * r + y);
            C.lineTo(x, y);
            C.stroke();
          }
        }
      }
      C.restore();
    }
  }
  C.restore();
  animationId = requestAnimationFrame(f);
};

window.onload = function () {
  makeCanvas();
  initialize();
  f();
  W.onresize = function () {
    cancelAnimationFrame(animationId);
    initialize();
    f();
  };
};