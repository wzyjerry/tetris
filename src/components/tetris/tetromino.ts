export enum Status {
  Empty,
  Fill,
}
export interface Box {
  status: Status;
  kind: Tetromino;
}

export type Board = Box[][];
export interface Form {
  kind: Tetromino;
  x: number;
  y: number;
  rotate: number;
}
export enum Tetromino {
  Empty = '',
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z',
}

// I % 2          J % 4          L % 4          O % 1         S % 2         T % 4         Z % 2
// Rotate - 0:    Rotate - 0:    Rotate - 0:    Rotate - 0:   Rotate - 0:   Rotate - 0:   Rotate - 0:
// xxxx           Oxx            xxO            xxxx          xxx           xOx           xxx
// xxxx           O@O            O@O            xOOx          x@O           O@O           O@x
// OO@O           xxx            xxx            x@Ox          OOx           xxx           xOO
// xxxx                                         xxxx
//                Rotate - 1:    Rotate - 1:                  Rotate - 1:   Rotate - 1:   Rotate - 1:
// Rotate - 1:    xOO            xOx                          xOx           xOx           xxO
// xxOx           x@x            x@x                          x@O           x@O           x@O
// xxOx           xOx            xOO                          xxO           xOx           xOx
// xx@x
// xxOx           Rotate - 2:    Rotate - 2:                                Rotate - 2:
//                xxx            xxx                                        xxx
//                O@O            O@O                                        O@O
//                xxO            Oxx                                        xOx
//
//                Rotate - 3:    Rotate - 3:                                Rotate - 3:
//                xOx            OOx                                        xOx
//                x@x            x@x                                        O@x
//                OOx            xOx                                        xOx

const d = new Map<Tetromino, number[][][]>([
  [
    Tetromino.I,
    [
      [
        [-2, 0],
        [-1, 0],
        [0, 0],
        [1, 0],
      ],
      [
        [0, -2],
        [0, -1],
        [0, 0],
        [0, 1],
      ],
    ],
  ],
  [
    Tetromino.J,
    [
      [
        [-1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
      ],
      [
        [1, -1],
        [0, -1],
        [0, 0],
        [0, 1],
      ],
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, 1],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [-1, 1],
      ],
    ],
  ],
  [
    Tetromino.L,
    [
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [1, -1],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [-1, 1],
        [-1, 0],
        [0, 0],
        [1, 0],
      ],
      [
        [-1, -1],
        [0, -1],
        [0, 0],
        [0, 1],
      ],
    ],
  ],
  [
    Tetromino.O,
    [
      [
        [0, -1],
        [1, -1],
        [1, 0],
        [0, 0],
      ],
    ],
  ],
  [
    Tetromino.S,
    [
      [
        [1, 0],
        [0, 0],
        [0, 1],
        [-1, 1],
      ],
      [
        [0, -1],
        [0, 0],
        [1, 0],
        [1, 1],
      ],
    ],
  ],
  [
    Tetromino.T,
    [
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [0, -1],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [0, 1],
      ],
      [
        [0, -1],
        [0, 0],
        [0, 1],
        [-1, 0],
      ],
    ],
  ],
  [
    Tetromino.Z,
    [
      [
        [-1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [1, -1],
        [1, 0],
        [0, 0],
        [0, 1],
      ],
    ],
  ],
]);

const CanPlace = (board: Board, form: Form): boolean => {
  const by = board.length;
  const bx = by > 0 ? board[0].length : 0;
  const kd = d.get(form.kind);
  if (kd === undefined) {
    return false;
  }
  const rotate = form.rotate % kd.length;
  for (const dd of kd[rotate]) {
    const x = form.x + dd[0];
    const y = form.y + dd[1];
    if (x < 0 || x >= bx || y < 0 || y >= by) {
      return false;
    }
    if (board[y][x].status !== Status.Empty) {
      return false;
    }
  }
  return true;
};

const Place = (board: Board, form: Form) => {
  const kd = d.get(form.kind);
  if (kd === undefined) {
    return board;
  }
  const rotate = form.rotate % kd.length;
  for (const dd of kd[rotate]) {
    const x = form.x + dd[0];
    const y = form.y + dd[1];
    board[y][x].status = Status.Fill;
    board[y][x].kind = form.kind;
  }
};

const display = new Map<Tetromino, Form>([
  [
    Tetromino.I,
    {
      kind: Tetromino.I,
      x: 2,
      y: 1,
      rotate: 0,
    },
  ],
  [
    Tetromino.J,
    {
      kind: Tetromino.J,
      x: 1,
      y: 1,
      rotate: 0,
    },
  ],
  [
    Tetromino.L,
    {
      kind: Tetromino.L,
      x: 1,
      y: 1,
      rotate: 0,
    },
  ],
  [
    Tetromino.O,
    {
      kind: Tetromino.O,
      x: 1,
      y: 1,
      rotate: 0,
    },
  ],
  [
    Tetromino.S,
    {
      kind: Tetromino.S,
      x: 1,
      y: 0,
      rotate: 0,
    },
  ],
  [
    Tetromino.T,
    {
      kind: Tetromino.T,
      x: 1,
      y: 1,
      rotate: 0,
    },
  ],
  [
    Tetromino.Z,
    {
      kind: Tetromino.Z,
      x: 1,
      y: 0,
      rotate: 0,
    },
  ],
]);

export { display, CanPlace, Place };
