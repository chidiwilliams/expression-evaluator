const assert = require('assert');
const { evaluate } = require('./evaluator');

/**
 * These tests are in a different file because they update the state
 * of the environment and must be run in the specified order.
 */
const testCases = [
  {
    input: 'SET(#FR, 45 + 50)',
    output: 95,
    message: 'setting the value of a variable',
  },
  {
    input: 'SET(#FR, $FR + 5)',
    output: 100,
    message: 'updating value of already set variable',
  },
  {
    input: '$FR * 10',
    output: 1000,
    message: 'accessing a set variable',
  },
];

testCases.forEach((test) => {
  assertEqual(evaluate(test.input), test.output, `evaluator: ${test.message}`);
});

function assertEqual(actual, expected, message) {
  assert.deepStrictEqual(
    actual,
    expected,
    `${message}: expected: ${expected}, got: ${actual}`,
  );
}
