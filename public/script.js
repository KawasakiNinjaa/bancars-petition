// thisis where I place the canvas-related shit

//mousedown, mouseup, mousemove
//get x/y coords
(() => {
  var canvas = document.getElementById("canvas");

  var ctx = canvas.getContext("2d");
  var signInput = document.getElementById("signInput");
  var signButton = document.getElementById("sign");

  //console.log("canvas: ", canvas);

  // set up context
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  //

  let onX = 0;
  let onY = 0;
  let userDrawing = false;

  function draw(e) {
    if (!userDrawing) return;
    ctx.beginPath();
    ctx.moveTo(onX, onY);
    ctx.lineTo(e.offsetX, e.offsetY);
    onX = e.offsetX;
    onY = e.offsetY;
    ctx.stroke();
  }
  //

  canvas.addEventListener(`mousedown`, e => {
    userDrawing = true;
    onX = e.offsetX;
    onY = e.offsetY;
  });
  canvas.addEventListener(`mousemove`, draw);

  canvas.addEventListener(`mouseup`, () => {
    userDrawing = false;
  });
  // when user hits button "sign", the actual signature in the canvas will be stored in the hidden input (and later sent and stored in the DB along firstName and lastName )
  signButton.addEventListener(`click`, () => {
    signInput.value = canvas.toDataURL();
    console.log("signInput.value: ", signInput.value);
  });
})();
