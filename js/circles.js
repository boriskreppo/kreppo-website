const POS = [
  { left: 0, top: 0 },  // 0 topLeft
  { left: 156, top: 0 },  // 1 topRight
  { left: 0, top: 156 },  // 2 midLeft
  { left: 156, top: 156 },  // 3 midRight
  { left: 0, top: 312 },  // 4 lowerLeft
  { left: 156, top: 312 },  // 5 lowerRight
  { left: 156, top: 468 },  // 6 bottom
  { left: 0, top: 468 },  // 7 bottomLeft
];

const IDS = ['c35', 'c30', 'c31', 'c36', 'c32', 'c33'];

// state[i] = slot for IDS[i]
let state = [1, 2, 3, 4, 5, 6];

// Moves defined as [fromSlot, toSlot]:
// "take whichever circle is on fromSlot and move it to toSlot"
const MOVES = [
  [2, 0],  // midLeft circle → topLeft
  [4, 2],  // lowerLeft circle → midLeft
  [6, 7],  // bottom circle → bottomLeft (over text)
  [5, 6],  // lowerRight circle → bottom
  [7, 4],  // bottomLeft circle → lowerLeft
  [3, 5],  // midRight circle → lowerRight
  [1, 3],  // topRight circle → midRight
  [0, 1],  // topLeft circle → topRight
];

let moveIndex = 0;

function findCircleAtSlot(slot) {
  for (let i = 0; i < state.length; i++) {
    if (state[i] === slot) return i;
  }
  return -1;
}

function applyPositions() {
  IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const pos = POS[state[i]];
    el.style.left = pos.left + 'px';
    el.style.top = pos.top + 'px';
  });
}

function nextMove() {
  const [fromSlot, toSlot] = MOVES[moveIndex % MOVES.length];
  const i = findCircleAtSlot(fromSlot);
  if (i >= 0) state[i] = toSlot;
  applyPositions();
  moveIndex++;
}

document.addEventListener('DOMContentLoaded', () => {
  applyPositions();
  setInterval(nextMove, 800);
});
