import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver, div, h1 } from '@cycle/dom';

require('file?name=[name].[ext]!./index.html');

function main() {
  return {
    DOM: xs.of(
      div('.calculator', [
        div('.result', '0'),
        div('.row', [
          div('.button', '1'),
          div('.button', '2'),
          div('.button', '3'),
        ]),
        div('.row', [
          div('.button', '4'),
          div('.button', '5'),
          div('.button', '6')
        ]),
        div('.row', [
          div('.button', '7'),
          div('.button', '8'),
          div('.button', '9')
        ]),
        div('.row', [
          div('.button', ' '),
          div('.button', '0'),
          div('.button', ' '),

        ])
      ])
    )
  };
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
