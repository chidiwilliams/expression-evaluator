const assert = require('assert');
const { tokenize, toRPN, evalRPN, evaluate } = require('./simple');

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
    input: '1 * 3 )',
    tokens: [1, '*', 3, ')'],
    rpn: [1, 3, '*'],
    output: 3,
    message: 'with unbalanced parantheses',
  },
  {
    input: '24 + 5 * (6 - 3 ^ 2 ^ 2)',
    tokens: [24, '+', 5, '*', '(', 6, '-', 3, '^', 2, '^', 2, ')'],
    rpn: [24, 5, 6, 3, 2, 2, '^', '^', '-', '*', '+'],
    output: -351,
    message: 'with operators with different precedences',
  },
];

testCases.forEach((test) => {
  assertEqual(tokenize(test.input), test.tokens, `tokenize: ${test.message}`);
  assertEqual(toRPN(test.tokens), test.rpn, `toRPN: ${test.message}`);
  assertEqual(evalRPN(test.rpn), test.output, `evalRPN: ${test.message}`);
  assertEqual(evaluate(test.input), test.output, `evaluator: ${test.message}`);
});

function assertEqual(actual, expected, message) {
  assert.deepStrictEqual(
    actual,
    expected,
    `${message}: expected: ${expected}, got: ${actual}`,
  );
}

module.exports = { testCases };
