import confetti from 'canvas-confetti';
import * as evaluator from './evaluator';

const inputElement = document.querySelector('#input');
const outputElement = document.querySelector('#output');
const envElement = document.querySelector('#env');

inputElement.addEventListener('input', (event) => {
  runEvaluator(event.target.value);
});

function runEvaluator(expression) {
  try {
    const result = evaluator.evaluate(expression);
    outputElement.innerText = result ?? '';
    outputElement.classList.remove('error');

    if (result === Infinity) {
      runConfetti();
    }
  } catch (error) {
    outputElement.innerText = error;
    outputElement.classList.add('error');
  }

  const envStr = Object.entries(evaluator.environment)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');

  envElement.innerText = envStr;
}

// https://www.kirilv.com/canvas-confetti/#fireworks
function runConfetti() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 250);
}

runEvaluator(inputElement.value);
