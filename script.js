const { cloneDeep } = _;

// Config
const ROWS = 100;
const COLS = 100;
const GENERATIONS = 5206;
const SPEED = 42; // ms, roughly 24 frames/sec
const ALIVE = '#00ff00';
const DEAD = "black";

// Initial State
const FILL_COUNT = 500;
const GLIDER = [
  [5, 4],
  [6, 5],
  [4, 6],
  [5, 6],
  [6, 6],
]
let INIT = GLIDER
INIT = randomState(FILL_COUNT);

// Internal use
let CURR_GEN = 0;
let PREV_STATE = [];
let CURR_STATE = makeBlankState();
let IS_STILL = false;
const MOVES = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];
const log = console.log;

// Main program
main();

// Function Defs
function main() {
  log("starting");
  log("initial state:", INIT);
  createBoard();
  initializeState();
  const timeout = setInterval(() => {
    generate();
    CURR_GEN++;
    if (IS_STILL) {
      log(`still after ${CURR_GEN} generations`);
      clearTimeout(timeout);
    }
    if (CURR_GEN > GENERATIONS) {
      log(`finished ${GENERATIONS} generations`);
      clearTimeout(timeout);
    }
  }, SPEED);
}

function createBoard() {
  const board = document.getElementById("app");

  for (let y = 0; y < COLS; y++) {
    const row = document.createElement("div");
    row.style.width = `100%`;
    row.style.height = `${100 / COLS}%`;
    row.style.display = "flex";

    for (let x = 0; x < ROWS; x++) {
      const cell = document.createElement("div");
      cell.style.width = `${100 / ROWS}%`;
      cell.style.height = `100%`;
      cell.style.backgroundColor = DEAD;
      cell.id = toCellId(x, y);
      row.appendChild(cell);
    }

    board.appendChild(row);
  }
}

function initializeState() {
  for (let [x, y] of INIT) {
    CURR_STATE[y][x] = 1;
    const cell = document.getElementById(toCellId(x, y));
    cell.style.backgroundColor = ALIVE;
  }
}

function generate() {
  PREV_STATE = cloneDeep(CURR_STATE);
  CURR_STATE = getNextState(PREV_STATE);
  IS_STILL = isPrevStateNextState(PREV_STATE, CURR_STATE)
  render(CURR_STATE);
}

function getNextState(state) {
  const newState = makeBlankState();
  for (let y = 0; y < COLS; y++) {
    for (let x = 0; x < ROWS; x++) {
      const cellState = state[y][x];
      const neighbourScore = getNeighbourScore(state, x, y);
      if (cellState === 1 && (neighbourScore === 3 || neighbourScore === 2)) {
        newState[y][x] = 1;
      } else if (cellState === 0 && neighbourScore === 3) {
        newState[y][x] = 1;
      } else {
        newState[y][x] = 0;
      }
    }
  }
  return newState;
}

function render(state) {
  for (let y = 0; y < COLS; y++) {
    for (let x = 0; x < ROWS; x++) {
      const cellState = state[y][x];
      const cell = document.getElementById(toCellId(x, y));
      cell.style.backgroundColor = cellState === 1 ? ALIVE : DEAD;
    }
  }
}

function makeBlankState() {
  return new Array(COLS).fill(0).map((_) => new Array(ROWS).fill(0));
}

function getNeighbourScore(state, x, y) {
  let score = 0;
  for (let [diffX, diffY] of MOVES) {
    let targX = x + diffX;
    let targY = y + diffY;
    if (targX < 0) targX += ROWS;
    if (targY < 0) targY += COLS;
    if (targX >= ROWS) targX %= ROWS;
    if (targY >= COLS) targY %= COLS;
    score += state[targY][targX];
  }
  return score;
}

function toCellId(x, y) {
  return `${x}_${y}`;
}

function randomState(numberToFill) {
  const starts = [];
  for (let i = 0; i < numberToFill; i++) {
    const randX = Math.floor(Math.random() * ROWS);
    const randY = Math.floor(Math.random() * COLS);
    starts.push([randX, randY]);
  }
  return starts;
}

function isPrevStateNextState(a, b) {
  for (let y = 0; y < COLS; y++) {
    for (let x = 0; x < ROWS; x++) {
      if (a[y][x] !== b[y][x]) {
        return false;
      }
    }
  }
  return true;
}
