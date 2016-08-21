import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver, div, h1 } from '@cycle/dom';

require('file?name=[name].[ext]!./index.html');

function intent(domSource) {
  return domSource.select('.button').events('click')
    .filter(event => event.target.textContent !== '')
    .map(event => parseInt(event.target.textContent, 10));
}

function model(buttonSelect$) {
  return buttonSelect$.startWith(0);
}

function view(state$) {
  return state$.map(value =>
    div('.calculator', [
      div('.result', `${value}`),
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
        div('.button'),
        div('.button', '0'),
        div('.button'),
      ])
    ])
  );
}

function main(sources) {
  return {
    DOM: view(model(intent(sources.DOM)))
  };
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);
