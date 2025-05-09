const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let circles = [];
let selectedCircle = null;
let isDragging = false;
const defaultRadius = 20;
const minRadius = 5;

// Utility to get mouse position relative to canvas
function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Redraw all circles
function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle === selectedCircle ? 'red' : 'blue';
    ctx.fill();
    ctx.closePath();
  });
}

// Detect if a point is inside a circle
function getCircleAtPos(x, y) {
  return circles.find(circle => {
    const dx = x - circle.x;
    const dy = y - circle.y;
    return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
  });
}

// Mouse down to select or add circle
canvas.addEventListener('mousedown', function (e) {
  const pos = getMousePos(e);
  const clickedCircle = getCircleAtPos(pos.x, pos.y);

  if (clickedCircle) {
    selectedCircle = clickedCircle;
    isDragging = true;
  } else {
    circles.push({ x: pos.x, y: pos.y, radius: defaultRadius });
    selectedCircle = null;
  }

  drawCircles();
});

// Mouse move to drag selected circle
canvas.addEventListener('mousemove', function (e) {
  if (isDragging && selectedCircle) {
    const pos = getMousePos(e);
    selectedCircle.x = pos.x;
    selectedCircle.y = pos.y;
    drawCircles();
  }
});

// Mouse up to stop dragging
canvas.addEventListener('mouseup', function () {
  isDragging = false;
});

// Scroll to resize selected circle
canvas.addEventListener('wheel', function (e) {
  if (selectedCircle) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 2 : -2;
    selectedCircle.radius = Math.max(minRadius, selectedCircle.radius + delta);
    drawCircles();
  }
});

// Delete key to remove selected circle
document.addEventListener('keydown', function (e) {
  if (e.key === 'Delete' && selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    drawCircles();
  }
});

// Clear Canvas Button
document.getElementById('clearCanvasBtn').addEventListener('click', function () {
  circles = [];
  selectedCircle = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});