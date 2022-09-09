import { random } from 'lodash';
import { Tetromino } from './tetromino';
interface TetrisProvidor {
  GetNext(): Tetromino;
  GetScore(line: number, cline: number): number;
  GetCurrentLv(line: number): number;
  GetCurrentSpeed(line: number): number;
}

class LocalProvider implements TetrisProvidor {
  readonly blockMap = new Map<number, Tetromino>([
    [1, Tetromino.I],
    [2, Tetromino.J],
    [3, Tetromino.L],
    [4, Tetromino.O],
    [5, Tetromino.S],
    [6, Tetromino.T],
    [7, Tetromino.Z],
  ]);
  isFirst = true;
  history = [Tetromino.Z, Tetromino.Z, Tetromino.S, Tetromino.S];
  nxt = 0;
  readonly maxRetries = 6;
  readonly speeds = [
    48, 43, 38, 33, 28, 23, 18, 13, 8, 6, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2,
  ];
  readonly startLv: number;
  readonly first: number;
  constructor(startLv: number) {
    this.startLv = startLv;
    this.first = startLv * 10 + 10;
    if (this.first > 100) {
      const second = startLv * 10 - 50;
      if (second <= 100) {
        this.first = 100;
      } else {
        this.first = second;
      }
    }
  }
  GetCurrentLv(line: number): number {
    if (line <= this.first) {
      return this.startLv;
    }
    return this.startLv + Math.floor((line - this.first) / 10);
  }
  GetCurrentSpeed(line: number): number {
    const lv = this.GetCurrentLv(line);
    if (lv < 29) {
      return this.speeds[lv];
    }
    return 1;
  }
  GetScore(line: number, cline: number): number {
    const lv = this.GetCurrentLv(line) + 1;
    switch (cline) {
      case 1:
        return 40 * lv;
      case 2:
        return 100 * lv;
      case 3:
        return 300 * lv;
      case 4:
        return 1200 * lv;
    }
    return 0;
  }
  GetNext(): Tetromino {
    if (this.isFirst) {
      let rand = random(1, 7, false);
      while (
        this.blockMap.get(rand) === Tetromino.O ||
        this.blockMap.get(rand) === Tetromino.S ||
        this.blockMap.get(rand) === Tetromino.Z
      ) {
        rand = random(1, 7, false);
      }
      this.isFirst = false;
      const t = this.blockMap.get(rand)!;
      this.history[this.nxt] = t;
      this.nxt = (this.nxt + 1) % 4;
      return t;
    }
    for (let i = 0; i < this.maxRetries; i++) {
      const rand = random(1, 7, false);
      const t = this.blockMap.get(rand)!;
      let exist = false;
      for (let h of this.history) {
        if (t === h) {
          exist = true;
          break;
        }
      }
      if (!exist) {
        this.history[this.nxt] = t;
        this.nxt = (this.nxt + 1) % 4;
        return t;
      }
    }
    const rand = random(0, 3, false);
    const t = this.blockMap.get(rand)!;
    this.history[this.nxt] = t;
    this.nxt = (this.nxt + 1) % 4;
    return t;
  }
}

export { TetrisProvidor, LocalProvider };
