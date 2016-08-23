import xs from 'xstream';
import { run } from '@cycle/xstream-run';
import { makeDOMDriver, div, h1 } from '@cycle/dom';

require('file?name=[name].[ext]!./index.html');

const CLEAR = 'C';
const ADD = '+';
const SUBTRACT = '-';
const MULTIPLY = '*';
const DIVIDE = '/';
const EQUALS = '=';

const defaults = {
  total: 0,
  buffer: '',
  operator: ADD
};

function calculateTotal(operator, previousTotal, bufferValue) {
  if(operator === ADD) {
    return previousTotal + bufferValue;
  }
  if(operator === SUBTRACT) {
    return previousTotal - bufferValue;
  }
  if(operator === MULTIPLY) {
    return previousTotal * bufferValue;
  }
  if(operator === DIVIDE) {
    return previousTotal / bufferValue;
  }
  return previousTotal;
}

function intent(domSource) {
  const numberClick$ = domSource.select('.value').events('click')
    .map(event => parseInt(event.target.textContent, 10));
  const operatorClick$ = domSource.select('.operator').events('click')
    .map(event => event.target.textContent);
  return { numberClick$, operatorClick$ };
}

function model({ numberClick$, operatorClick$ }) {
  const number$ = numberClick$.startWith(0);
  const operator$ = operatorClick$.startWith(ADD);
  const buffer$ = xs.merge(numberClick$, operatorClick$)
    .fold((prev, input) => {
      if(Number.isInteger(input)) {
        return {
          total: prev.total,
          buffer: `${prev.buffer}${input}`,
          operator: prev.operator
        };
      }

      if(input === CLEAR) {
        return defaults;
      }

      if(prev.buffer === '') {
        return {
          total: prev.total,
          buffer: '',
          operator: input
        };
      }

      if(prev.operator === EQUALS) {
        return {
          total: parseInt(prev.buffer, 10),
          buffer: '',
          operator: input
        };
      }

      return {
          total: calculateTotal(prev.operator, prev.total, parseInt(prev.buffer, 10)),
          buffer: '',
          operator: input
      };
    }, defaults);

  return buffer$.debug();
}

function view(state$) {
  return state$.map(({ total, buffer, operator }) =>
    div('.calculator', [
      div('.result', `${buffer === '' ? total : buffer}`),
      div('.row', [
        div('.button.value', '1'),
        div('.button.value', '2'),
        div('.button.value', '3'),
        div('.button.operator', DIVIDE)
      ]),
      div('.row', [
        div('.button.value', '4'),
        div('.button.value', '5'),
        div('.button.value', '6'),
        div('.button.operator', MULTIPLY)
      ]),
      div('.row', [
        div('.button.value', '7'),
        div('.button.value', '8'),
        div('.button.value', '9'),
        div('.button.operator', SUBTRACT)
      ]),
      div('.row', [
        div('.button.operator', CLEAR),
        div('.button.value', '0'),
        div('.button.operator', EQUALS),
        div('.button.operator', ADD)
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
