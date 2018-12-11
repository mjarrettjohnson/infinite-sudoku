import {
  lensIndex,
  ifElse,
  identity,
  find,
  compose,
  uniqBy,
  uniq,
  difference,
  sortBy
} from 'ramda';
const boards = require('../boards.json');

const size = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let max = 0;

export const createRows = () => {
  let baseZ = 1;
  let z = 1;

  return size.map(y => {
    const row = size.map(x => {
      const cell = { x, y, z, poss: size };

      if (x % 3 === 0) z = z + 1;

      return cell;
    });

    if (y % 3 === 0) baseZ = baseZ + 3;

    z = baseZ;

    return row;
  });
};

const getCountOfFilledCells = values => values.filter(t => !!t).length;

const emptyBoard = values => {
  const update = values.map(t => t);
  while (getCountOfFilledCells(update) > 25) {
    const random = Math.floor(Math.random() * 80);
    update[random] = 0;
  }
  update.reverse();
  return update;
};

const fillFromValueArray = cells => {
  const random = Math.floor(Math.random() * 976);
  const board = emptyBoard(boards[random]);
  return cells.map((cell, index) => ({ ...cell, value: board[index] }));
};

export const convertRowsToCells = rows =>
  rows.reduce((acc, curr) => {
    return [...acc, ...curr];
  }, []);

export const convertCellsToRows = cells => {
  const rows = [];

  let currentRow = [];

  cells.forEach((cell, index) => {
    currentRow.push({ ...cell });

    if ((index + 1) % 9 === 0) {
      rows.push(currentRow);
      currentRow = [];
    }
  });

  return rows;
};

const getCellsAt = (cells, coordinate, num) => {
  return cells.filter(cell => cell[coordinate] === num);
};

const getMatchingCells = (cells, cell) => {
  const xs = getCellsAt(cells, 'x', cell.x);
  const ys = getCellsAt(cells, 'y', cell.y);
  const zs = getCellsAt(cells, 'z', cell.z);
  const t = uniqBy(t => `${t.x}${t.y}`, [...xs, ...ys, ...zs]);
  return t;
};

const getMatchingCellsValues = (cells, cell) =>
  uniq(
    getMatchingCells(cells, cell).reduce((acc, curr) => {
      if (curr.value) {
        acc.push(curr.value);
      }
      return acc;
    }, [])
  );

const filterPoss = cells =>
  cells.map(cell => {
    const values = getMatchingCellsValues(cells, cell);
    return {
      ...cell,
      poss: difference(cell.poss, values)
    };
  });

const getNextCandidate = cells =>
  sortBy(cell => cell.poss.length, cells.filter(c => !c.value))[0];

const getAllSingleCandidateCells = cells =>
  cells.filter(cell => cell.poss.length === 1 && cell.value === 0);

export const isFinished = cells => !cells.some(cell => !cell.value);

const isInvalid = cells =>
  cells.some(cell => cell.value === 0 && cell.poss.length === 0);

const updateCells = (cells, candidate, value) =>
  cells.map(cell => {
    if (cell.x === candidate.x && cell.y === candidate.y) {
      return { ...cell, changed: true, value };
    }
    return { ...cell, changed: false };
  });

const updateBoardWithSingleCell = compose(
  filterPoss,
  updateCells
);

export const fillBoard = compose(
  convertCellsToRows,
  filterPoss,
  fillFromValueArray,
  convertRowsToCells
);

const clone = cells => cells.map(cell => ({ ...cell }));

const equals = first => second => first.x === second.x && first.y === second.y;

const unsafeReset = cell => (cell.value = 0);

const unsafeUpdate = candidate => cell => {
  cell.value = candidate.poss[0];
  cell.changed = true;
};

const truthy = x => !!x;

const fillAllSingleCellCandidates = cells => {
  const cloned = clone(cells);
  const singleCellCandidates = getAllSingleCandidateCells(cells);

  for (let k = 0; k < singleCellCandidates.length; k++) {
    const candidate = singleCellCandidates[k];

    compose(
      unsafeUpdate(candidate),
      find(equals(candidate))
    )(cloned);
  }

  return filterPoss(cloned);
};

export function* solve(cells) {
  max++;
  // const filled = fillAllSingleCellCandidates(cells);
  const filled = clone(cells);

  if (isInvalid(filled)) {
    return null;
  }

  if (isFinished(filled)) {
    return filled;
  }

  yield filled;

  const candidate = getNextCandidate(filled);

  for (let j = 0; j < candidate.poss.length; j++) {
    const possibility = candidate.poss[j];

    const update = updateBoardWithSingleCell(filled, candidate, possibility);
    const solved = yield* solve(update);

    if (solved) {
      return solved;
    }
  }

  return null;
}
export const init = compose(
  solve,
  convertRowsToCells,
  fillBoard,
  createRows
);

export const initBoard = compose(
  fillBoard,
  createRows
);

export const initSolver = compose(
  solve,
  convertRowsToCells
);
