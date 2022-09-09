import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { init, renderMain, renderScore } from './board';
import { event, KeyCode } from './event';
import { LocalProvider, TetrisProvidor } from './provider';
import {
  Board,
  CanPlace,
  display,
  Form,
  Place,
  Status,
  Tetromino,
} from './tetromino';

export interface TetrisProp {
  className?: string;
  startLv: number;
}

interface TetrisState {
  lv: number;
  board: Board;
  isEnd: boolean;
  line: number;
  score: number;
  fc: number;
  speed: number;
  next: Tetromino;
  provider: TetrisProvidor;
  hints: string[];
}

const Tetris: React.FC<TetrisProp> = (prop) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [state, setState] = useState<TetrisState>({
    lv: 0,
    board: [],
    isEnd: false,
    line: 0,
    score: 0,
    fc: 0,
    speed: 0,
    next: Tetromino.Empty,
    provider: new LocalProvider(prop.startLv),
    hints: [],
  });
  const [current, setCurrent] = useState<Form>({
    x: 0,
    y: 0,
    kind: Tetromino.Empty,
    rotate: 0,
  });
  const nextFrame: Board = [];
  for (let y = 0; y < 2; y++) {
    nextFrame.push([]);
    for (let x = 0; x < 4; x++) {
      nextFrame[y].push({
        status: Status.Empty,
        kind: Tetromino.Empty,
      });
    }
  }
  const scoring = () => {
    setState((old) => {
      let line = 0;
      const newBoard: Board = [];
      for (let y = 21; y >= 0; y--) {
        if (old.board[y].every((v) => v.status === Status.Fill)) {
          const remove = old.board.splice(y, 1);
          remove[0].forEach((v) => {
            v.status = Status.Empty;
            v.kind = Tetromino.Empty;
          });
          newBoard.push(remove[0]);
          line++;
        }
      }
      if (line > 0) {
        for (let i = 0; i < old.board.length; i++) {
          newBoard.push(old.board[i]);
        }
        old.board = newBoard;
        const score = old.provider.GetScore(old.line, line);
        old.line += line;
        old.score += score;
        switch (line) {
          case 1:
            old.hints.push(`Single + ${score}`);
            break;
          case 2:
            old.hints.push(`Double + ${score}!`);
            break;
          case 3:
            old.hints.push(`Triple + ${score}!!`);
            break;
          case 4:
            old.hints.push(`!!!Tetris!!! + ${score}`);
            break;
        }
        old.lv = old.provider.GetCurrentLv(old.line);
        old.speed = old.provider.GetCurrentSpeed(old.line);
      }
      return old;
    });
    const hints = [];
    for (let i = 5; i >= 1; i--) {
      if (state.hints.length - i >= 0) {
        hints.push(state.hints[state.hints.length - i]);
      } else {
        hints.push('');
      }
    }
    renderScore(
      d3
        .select<SVGSVGElement, undefined>(ref.current!)
        .selectChildren<SVGGElement, string[]>('.score'),
      hints,
      [`Lines: ${state.line}`, `Lv: ${state.lv}`, `Score: ${state.score}`],
    );
  };
  const setNext = () => {
    setCurrent((old) => {
      const init = _.cloneDeep(display.get(state.next)!);
      init.x += 3;
      setState((old) => {
        old.next = state.provider.GetNext();
        old.lv = state.provider.GetCurrentLv(old.line);
        old.speed = state.provider.GetCurrentSpeed(old.line);
        return old;
      });
      if (!CanPlace(state.board, init)) {
        setState((old) => {
          old.isEnd = true;
          old.hints.push('Game Over...');
          return old;
        });
        scoring();
      }
      _.assign(old, init);
      return old;
    });
    const frame = _.cloneDeep(nextFrame);
    Place(frame, display.get(state.next)!);
    renderMain(
      d3
        .select<SVGSVGElement, undefined>(ref.current!)
        .selectChildren<SVGGElement, Board>('.next'),
      frame,
    );
  };
  const dropDown = (): number => {
    const nextPos = _.cloneDeep(current);
    while (CanPlace(state.board, nextPos)) {
      nextPos.y++;
    }
    return nextPos.y - 1;
  };
  const board: Board = [];
  for (let y = 0; y < 22; y++) {
    board.push([]);
    for (let x = 0; x < 10; x++) {
      board[y].push({
        status: Status.Empty,
        kind: Tetromino.Empty,
      });
    }
  }
  const actionCb = (key: KeyCode) => {
    const nxtForm = _.cloneDeep(current);
    switch (key) {
      case KeyCode.ArrowUp:
        nxtForm.rotate = (nxtForm.rotate + 1) % 4;
        break;
      case KeyCode.ArrowDown:
        nxtForm.y = dropDown();
        setState((old) => {
          old.fc = old.speed - 1;
          return old;
        });
        break;
      case KeyCode.ArrowLeft:
        nxtForm.x--;
        break;
      case KeyCode.ArrowRight:
        nxtForm.x++;
        break;
    }
    if (CanPlace(state.board, nxtForm)) {
      setCurrent((c) => {
        _.assign(c, nxtForm);
        return c;
      });
    }
  };
  useEffect(() => {
    setState((old) => {
      old.board = board;
      old.next = old.provider.GetNext();
      return old;
    });
    setNext();
    scoring();
    init(
      d3
        .select<SVGSVGElement, undefined>(ref.current!)
        .selectChildren<SVGGElement, Board>('.board-static'),
    );
    event(actionCb);
    setInterval(() => {
      setState((old) => {
        if (old.isEnd) {
          return old;
        }
        old.fc++;
        if (old.fc >= old.speed) {
          old.fc = 0;
          const nextPos = _.cloneDeep(current);
          nextPos.y++;
          if (CanPlace(old.board, nextPos)) {
            setCurrent((old) => {
              old.y++;
              return old;
            });
          } else {
            // 放置，消行，加分，切换
            Place(old.board, current);
            scoring();
            setNext();
          }
        }
        return old;
      });

      const frame = _.cloneDeep(state.board);
      Place(frame, current);
      renderMain(
        d3
          .select<SVGSVGElement, undefined>(ref.current!)
          .selectChildren<SVGGElement, Board>('.board'),
        frame.slice(2),
      );
    }, 1000 / 60);
  }, [ref]);
  return (
    <svg ref={ref} className={prop.className}>
      <g className="board-static"></g>
      <g className="board" transform="translate(36 36)"></g>
      <g className="next" transform="translate(576 36)"></g>
      <g className="score" transform="translate(552 180)"></g>
    </svg>
  );
};
export default Tetris;
