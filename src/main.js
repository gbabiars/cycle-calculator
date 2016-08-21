import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver, div, h1 } from '@cycle/dom';

require('file?name=[name].[ext]!./index.html');

function intent(domSource) {
  return domSource.select('.value').events('click')
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
        div('.button.value', '1'),
        div('.button.value', '2'),
        div('.button.value', '3'),
        div('.button.operator', '/')
      ]),
      div('.row', [
        div('.button.value', '4'),
        div('.button.value', '5'),
        div('.button.value', '6'),
        div('.button.operator', '*')
      ]),
      div('.row', [
        div('.button.value', '7'),
        div('.button.value', '8'),
        div('.button.value', '9'),
        div('.button.operator', '-')
      ]),
      div('.row', [
        div('.button.placeholder'),
        div('.button.value', '0'),
        div('.button.placeholder'),
        div('.button.operator', '+')
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
