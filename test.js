const assert = require('assert');
const { evaluator, evaluate, tokenize, parse } = require('.');

const testCases = [
  {
    input: '2 + 2',
    tokens: [2, '+', 2],
    rpn: ['+', '2', '2'],
    output: 4,
    message: 'should add two numbers',
  },
];

testCases.forEach((test) => {
  assert.deepStrictEqual(
    tokenize(test.input),
    test.tokens,
    `tokenize: ${test.message}`,
  );
  // assert.strictEqual(parse(test.tokens), test.rpn, `parse: ${test.message}`);
  // assert.strictEqual(
  //   evaluate(test.rpn),
  //   test.output,
  //   `evaluate: ${test.message}`,
  // );
  // assert.strictEqual(
  //   evaluator(test.input),
  //   test.output,
  //   `evaluator: ${test.message}`,
  // );
});
