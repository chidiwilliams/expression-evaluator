const assert = require('assert');
const { evaluator, evaluate, tokenize, parse } = require('.');

const testCases = [
  {
    input: '2 + 2',
    tokens: [2, '+', 2],
    rpn: [2, 2, '+'],
    message: 'simple',
  },
  {
    input: '0.3 * 0.95',
    tokens: [0.3, '*', 0.95],
    rpn: [0.3, 0.95, '*'],
    message: 'with decimals',
  },
  {
    input: '24 + 5 * 6 - 3',
    tokens: [24, '+', 5, '*', 6, '-', 3],
    rpn: [24, 5, 6, '*', '+', 3, '-'],
    message: 'with operators with different precedences',
  },
];

testCases.forEach((test) => {
  assertEqual(tokenize(test.input), test.tokens, `tokenize: ${test.message}`);
  assertEqual(parse(test.tokens), test.rpn, `parse: ${test.message}`);
});

function assertEqual(actual, expected, message) {
  assert.deepStrictEqual(
    actual,
    expected,
    `${message}: expected: ${expected}, got: ${actual}`,
  );
}
