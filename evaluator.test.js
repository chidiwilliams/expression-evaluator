const assert = require('assert');
const { evalRPN, evaluate, toRPN, tokenize } = require('./evaluator');
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
  {
    input: '54 + SQRT(49) * 8',
    tokens: [54, '+', 'SQRT', '(', 49, ')', '*', 8],
    rpn: [54, 49, 'SQRT', 8, '*', '+'],
    output: 110,
    message: 'with function and operators with different precedences',
  },
  {
    input: 'IF(54 < 3, 6, 9) + 20',
    tokens: ['IF', '(', 54, '<', 3, ',', 6, ',', 9, ')', '+', 20],
    rpn: [54, 3, '<', 6, 9, 'IF', 20, '+'],
    output: 29,
    message: 'with function and operators with different precedences',
  },
  {
    input: '$PI * 78 + $E',
    tokens: ['$PI', '*', 78, '+', '$E'],
    rpn: ['$PI', 78, '*', '$E', '+'],
    output: 247.7625088084629,
    message: 'with predefined variable',
  },
  // Next two tests must be run in order
  {
    input: 'SET($FR, 45 + 90 * 78)',
    tokens: ['SET', '(', '$FR', ',', 45, '+', 90, '*', 78, ')'],
    rpn: ['$FR', 45, 90, 78, '*', '+', 'SET'],
    output: 7065,
    message: 'with function to update environment',
  },
  {
    input: '$FR + 98',
    tokens: ['$FR', '+', 98],
    rpn: ['$FR', 98, '+'],
    output: 7163,
    message: 'with accessed user-defined variable',
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
