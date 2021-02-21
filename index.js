import * as simple from './simple';

const inputElement = document.querySelector('#input');
const outputElement = document.querySelector('#output');

inputElement.addEventListener('input', (event) => {
  try {
    const expression = event.target.value;
    const result = simple.evaluate(expression);
    outputElement.innerText = result ?? '';
    outputElement.classList.remove('error');
  } catch (error) {
    outputElement.innerText = error;
    outputElement.classList.add('error');
  }
});
