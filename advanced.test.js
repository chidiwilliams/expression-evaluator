const assert = require('assert');
const { evalRPN, evaluate, toRPN, tokenize } = require('./advanced');
const { testCases: simpleTestCases } = require('./simple.test');

const testCases = [
  ...simpleTestCases,
  {
    input: 'MAX(50, 10)',
    tokens: ['MAX', '(', 50, ',', 10, ')'],
    rpn: [50, 10, 'MAX'],
    output: 50,
    message: 'with MAX function',
  },
  {
    input: '54 + SQRT(49)',
    tokens: [54, '+', 'SQRT', '(', 49, ')'],
    rpn: [54, 49, 'SQRT', '+'],
    output: 61,
    message: 'with SQRT function',
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
