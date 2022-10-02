const { cloneDeep } = _;

// Config
const ROWS = 100; // Number of cells on x axis
const COLS = 100; // Number of cells on y axis
const GENERATIONS = 5206; // Number of times to generate a new state
const SPEED = 42; // Speed to run in ms, 42ms is roughly 24 frames/sec
const ALIVE = '#00ff00'; // Color to make Alive cells
const DEAD = "black"; // Color to make Dead cells
const DEBUG = true; // Logs to console, noop if false

// Initial State
const FILL_COUNT = 500;
const GLIDER = [
  [5, 4],
  [6, 5],
  [4, 6],
  [5, 6],
  [6, 6],
]
let INITIAL_STATE = GLIDER
// Start with random pattern, comment out to start with above.
INITIAL_STATE = randomState(FILL_COUNT);

// Internal use
let CURR_GEN = 0;
let PREV_STATE = makeBlankState();
let CURR_STATE = makeBlankState();
let IS_STILL = false;
const NEIGHBOURS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];
const log = DEBUG ? console.log : () => {};

// Main program
main();

// Function Defs
function main() {
  log("starting");
  log("initial state:", INITIAL_STATE);
  createBoard();
  initializeState();
  const timeout = setInterval(() => {
    runGeneration();
    CURR_GEN++;
    if (IS_STILL) {
      log(`still after ${CURR_GEN} generations`);
      clearInterval(timeout);
    }
    if (CURR_GEN > GENERATIONS) {
      log(`finished ${GENERATIONS} generations`);
      clearInterval(timeout);
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
  for (let [x, y] of INITIAL_STATE) {
    CURR_STATE[y][x] = 1;
    const cell = document.getElementById(toCellId(x, y));
    cell.style.backgroundColor = ALIVE;
  }
}

function runGeneration() {
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
      const neighboursScore = getNeighboursScore(state, x, y);
      if (cellState === 1 && (neighboursScore === 3 || neighboursScore === 2)) {
        newState[y][x] = 1;
      } else if (cellState === 0 && neighboursScore === 3) {
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
      const currStateColor = cell.style.backgroundColor;
      const nextStateColor = cellState === 1 ? ALIVE : DEAD;
      if (currStateColor === nextStateColor) {
        continue;
      } else {
        cell.style.backgroundColor = nextStateColor;
      }
    }
  }
}

function makeBlankState() {
  return new Array(COLS).fill(0).map((_) => new Array(ROWS).fill(0));
}

function getNeighboursScore(state, x, y) {
  let score = 0;
  for (let [diffX, diffY] of NEIGHBOURS) {
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
