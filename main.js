
var c = document.getElementById("Canvas")
var ctx = c.getContext("2d")

var canvas_height, canvas_width;
var shells = [];
var pass = [];

var colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
'#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40']

// reset size khi kích cỡ cửa sổ thay đổi
function reset() {
    canvas_height = window.innerHeight;
    canvas_width = window.innerWidth;
    c.width = canvas_width;
    c.height = canvas_height;
}
window.onresize = function() {
    reset();
}
reset();
// create newShell
function newShell() {
    var fromLeft = Math.random() > 0.5;
    var shell = {};

    //gia tri ket thuc
    shell.x = 1*fromLeft;
    shell.y = 1
    
    //gia tri khoi dau
    shell.x0 = (0.01 + Math.random()*0.007)*(fromLeft? 1: -1);
    shell.y0= 0.01 + Math.random()*0.007;
    shell.color = colors[Math.floor(Math.random()*colors.length)]
    shell.size = 3 + Math.random() * 6;

    shells.push(shell);
}

//Hieu ung explode
function explode(shell) {
    var count = Math.ceil(Math.pow(shell.size,2) * Math.PI);

    for(var i = 0; i < count; i++) {
        var pas = {};
        pas.x = shell.x * canvas_width;
        pas.y = shell.y * canvas_height;
        var a = Math.random() * 4;
        var s = Math.random() * 10;
        pas.x0 = s * Math.sin((5 - a) * (Math.PI / 2));
        pas.y0 = s * Math.sin(a * Math.PI / 2);
        pas.color = shell.color;
        pas.size = Math.sqrt(shell.size);
        if(pass.length < 1000) {
            pass.push(pas);
        }
    }

}

var lastRun = 0;
draw();
function draw() {
    var dt = 1;
    if (lastRun != 0) { dt = Math.min(50, (performance.now() - lastRun)); }
      lastRun = performance.now();
  
    //ctx.clearRect(0, 0, cwidth, cheight);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, canvas_width, canvas_height);
  
    if ((shells.length < 10) && (Math.random() > 0.96)) { newShell(); }
  
    for (var ix in shells) {
  
      var shell = shells[ix];
  
      ctx.beginPath();
      ctx.arc(shell.x * canvas_width, shell.y * canvas_height, shell.size, 0, 2 * Math.PI);
      ctx.fillStyle = shell.color;
      ctx.fill();
  
      shell.x -= shell.x0;
      shell.y -= shell.y0;
      shell.x0 -= (shell.x0 * dt * 0.001);
      shell.y0 -= ((shell.y0 + 0.2) * dt * 0.00005);
  
      if (shell.y0 < -0.005) {
        explode(shell);
        shells.splice(ix, 1);
      }
    }
  
    for (let ix in pass) {
  
      var pas = pass[ix];
  
      ctx.beginPath();
      ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
      ctx.fillStyle = pas.color;
      ctx.fill();
  
      pas.x -= pas.x0;
      pas.y -= pas.y0;
      pas.x0 -= (pas.x0 * dt * 0.001);
      pas.y0 -= ((pas.y0 + 5) * dt * 0.0005);
      pas.size -= (dt * 0.002 * Math.random())
  
      if ((pas.y > canvas_height)  || (pas.y < -50) || (pas.size <= 0)) {
          pass.splice(ix, 1);
      }
    }
    requestAnimationFrame(draw);
}
