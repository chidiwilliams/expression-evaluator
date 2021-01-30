function tokenize(input) {
  let scanner = 0;
  const tokens = [];

  while (scanner < input.length) {
    const char = input[scanner];

    const DIGITS = /[0-9]/;
    if (DIGITS.test(char)) {
      let str = '';
      let numberScanner = scanner;

      const DIGITS_OR_DOT = /[0-9\.]/;
      while (
        numberScanner < input.length &&
        DIGITS_OR_DOT.test(input[numberScanner])
      ) {
        str += input[numberScanner];
        numberScanner++;
      }

      const val = parseFloat(str);
      tokens.push(val);
      scanner = numberScanner;
      continue;
    }

    const SYMBOLS = /[+\-/*<>=(),]/;
    if (SYMBOLS.test(char)) {
      tokens.push(char);
      scanner++;
      continue;
    }

    if (char === ' ') {
      scanner++;
      continue;
    }

    throw new Error(`Invalid token ${char} at position ${scanner}`);
  }

  return tokens;
}

function parse(tokens) {
  function shouldUnwindOperatorStack(operators, nextToken) {
    const OPERATORS = {
      precedence: { '*': 2, '/': 2, '+': 1, '-': 1 },
      hasGreaterPrecedence: function (a, b) {
        return this.precedence[a] > this.precedence[b];
      },
      hasEqualPrecedence: function (a, b) {
        return this.precedence[a] === this.precedence[b];
      },
      isLeftAssociative: (operator) => {
        return /[+\-/*]/.test(operator);
      },
    };

    if (operators.length === 0) {
      return false;
    }

    const nextOperator = operators[operators.length - 1];
    return (
      OPERATORS.hasGreaterPrecedence(nextOperator, nextToken) ||
      (OPERATORS.hasEqualPrecedence(nextOperator, nextToken) &&
        OPERATORS.isLeftAssociative(nextOperator))
    );
  }

  const operators = [];
  const out = [];

  for (let scanner = 0; scanner < tokens.length; scanner++) {
    const token = tokens[scanner];

    if (typeof token === 'number') {
      out.push(token);
      continue;
    }

    const OPERATORS = /[+\-/*<>=]/;
    if (OPERATORS.test(token)) {
      while (shouldUnwindOperatorStack(operators, token)) {
        out.push(operators.pop());
      }
      operators.push(token);
      continue;
    }

    if (token === '(') {
      operators.push(token);
      continue;
    }

    if (token === ')') {
      while (operators[operators.length - 1] !== '(') {
        out.push(operators.pop());
      }
      operators.pop();
      continue;
    }

    throw new Error(`Unparsed token ${token} at position ${scanner}`);
  }

  for (let i = operators.length - 1; i >= 0; i--) {
    out.push(operators[i]);
  }

  return out;
}

function evaluate(rpn) {
  function getNumOperands(operator) {
    const ARITHMETIC_OPERATORS = /[+\-/*]/;
    if (ARITHMETIC_OPERATORS.test(operator)) {
      return 2;
    }
    throw new Error(`Invalid operator: ${operator}`);
  }

  function operateArithmetic(a, b, operator) {
    switch (operator) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '-':
        return a - b;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }

  function operate(operator, stack) {
    const operands = [];

    for (let i = 0; i < getNumOperands(operator); i++) {
      operands.push(stack.pop());
    }

    let result;
    const ARITHMETIC_OPERATORS = /[+\-/*]/;
    if (ARITHMETIC_OPERATORS.test(operator)) {
      result = operateArithmetic(operands[1], operands[0], operator);
    } else {
      throw new Error(`Invalid operator: ${operator}`);
    }

    stack.push(result);
    return stack;
  }

  const stack = [];

  for (let scanner = 0; scanner < rpn.length; scanner++) {
    const token = rpn[scanner];

    const OPERATORS = /[+\-/*<>=]/;
    if (OPERATORS.test(token)) {
      operate(token, stack);
      continue;
    }

    if (typeof token === 'number') {
      stack.push(token);
      continue;
    }

    throw new Error(`Invalid operator: ${operator}`);
  }

  return stack.pop();
}

function evaluator(input) {
  const tokens = tokenize(input);
  const rpn = parse(tokens);
  const output = evaluate(rpn);
  return output;
}

module.exports = {
  tokenize,
  parse,
  evaluate,
  evaluator,
};
