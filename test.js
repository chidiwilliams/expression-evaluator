const assert = require('assert');
const { evaluator, evaluate, tokenize, parse } = require('.');

const testCases = [
  {
    input: '2 + 2',
    tokens: [2, '+', 2],
    rpn: [2, 2, '+'],
    output: 4,
    message: 'simple',
  },
  {
    input: '0.3 * 0.95',
    tokens: [0.3, '*', 0.95],
    rpn: [0.3, 0.95, '*'],
    output: 0.285,
    message: 'with decimals',
  },
  {
    input: '24 + 5 * (6 - 3)',
    tokens: [24, '+', 5, '*', '(', 6, '-', 3, ')'],
    rpn: [24, 5, 6, 3, '-', '*', '+'],
    output: 39,
    message: 'with operators with different precedences',
  },
];

testCases.forEach((test) => {
  assertEqual(tokenize(test.input), test.tokens, `tokenize: ${test.message}`);
  assertEqual(parse(test.tokens), test.rpn, `parse: ${test.message}`);
  assertEqual(evaluate(test.rpn), test.output, `evaluate: ${test.message}`);
  assertEqual(evaluator(test.input), test.output, `evaluator: ${test.message}`);
});

function assertEqual(actual, expected, message) {
  assert.deepStrictEqual(
    actual,
    expected,
    `${message}: expected: ${expected}, got: ${actual}`,
  );
}
