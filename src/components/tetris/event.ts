import * as d3 from 'd3';

enum KeyCode {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
}

const event = (actionCb: (key: KeyCode) => void) => {
  const keyEnable = new Map();
  keyEnable.set(KeyCode.ArrowUp, true);
  keyEnable.set(KeyCode.ArrowDown, true);
  keyEnable.set(KeyCode.ArrowLeft, true);
  keyEnable.set(KeyCode.ArrowRight, true);

  d3.select('body')
    .on('keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case KeyCode.ArrowUp:
        case KeyCode.ArrowDown:
        case KeyCode.ArrowLeft:
        case KeyCode.ArrowRight:
          if (!keyEnable.get(event.code)) {
            return;
          }
          keyEnable.set(event.code, false);
          actionCb(event.key);
      }
    })
    .on('keyup', (event: KeyboardEvent) => {
      switch (event.key) {
        case KeyCode.ArrowUp:
        case KeyCode.ArrowDown:
        case KeyCode.ArrowLeft:
        case KeyCode.ArrowRight:
          keyEnable.set(event.code, true);
      }
    });
};

export { event, KeyCode };
