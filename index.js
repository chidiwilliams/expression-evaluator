function tokenize(input) {
  let scanner = 0;
  const tokens = [];

  while (scanner < input.length) {
    const char = input[scanner];

    const DIGITS = /[0-9]/;
    if (DIGITS.test(char)) {
      let digits = '';
      let numberScanner = scanner;

      const DIGITS_OR_DOT = /[0-9\.]/;
      while (
        numberScanner < input.length &&
        DIGITS_OR_DOT.test(input[numberScanner])
      ) {
        digits += input[numberScanner];
        numberScanner++;
      }

      const number = parseFloat(digits);
      tokens.push(number);
      scanner = numberScanner;
      continue;
    }

    const SYMBOLS = /[+\-/*<>=(),^]/;
    if (SYMBOLS.test(char)) {
      tokens.push(char);
      scanner++;
      continue;
    }

    if (char === ' ') {
      scanner++;
      continue;
    }

    const NAMES = /[A-Z]/;
    if (NAMES.test(char)) {
      let name = '';
      let nameScanner = scanner;

      while (nameScanner < input.length && NAMES.test(input[nameScanner])) {
        name += input[nameScanner];
        nameScanner++;
      }

      tokens.push(name);
      scanner = nameScanner;
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

    const OPERATORS = /[+\-/*<>=^]/;
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

    const NAMES = /[A-Z]/;
    if (NAMES.test(token)) {
      operators.push(token);
      continue;
    }

    if (token === ',') {
      while (operators[operators.length - 1] !== '(') {
        out.push(operators.pop());
      }
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
    const ARITHMETIC_OPERATORS = /[+\-/*^]/;
    if (ARITHMETIC_OPERATORS.test(operator)) {
      return 2;
    }
    throw new Error(`Invalid operator: ${operator}`);
  }

  function operate(operator, stack) {
    const operands = [];

    for (let i = 0; i < getNumOperands(operator); i++) {
      operands.push(stack.pop());
    }

    let result;
    const ARITHMETIC_OPERATORS = /[+\-/*^]/;
    if (ARITHMETIC_OPERATORS.test(operator)) {
      result = operateArithmetic(operands[0], operands[1], operator);
    } else {
      throw new Error(`Invalid operator: ${operator}`);
    }

    return result;
  }

  function operateArithmetic(a, b, operator) {
    switch (operator) {
      case '+':
        return b + a;
      case '-':
        return b - a;
      case '*':
        return b * a;
      case '/':
        return b / a;
      case '^':
        return Math.pow(b, a);
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }

  function apply(func, stack) {
    if (func === 'MAX') {
      const a = stack.pop();
      const b = stack.pop();
      return Math.max(b, a);
    }
    throw new Error(`Invalid operator: ${func}`);
  }

  const stack = [];

  for (let scanner = 0; scanner < rpn.length; scanner++) {
    const token = rpn[scanner];

    const OPERATORS = /[+\-/*<>^]/;
    if (OPERATORS.test(token)) {
      stack.push(operate(token, stack));
      continue;
    }

    if (typeof token === 'number') {
      stack.push(token);
      continue;
    }

    const NAMES = /[A-Z]/;
    if (NAMES.test(token)) {
      stack.push(apply(token, stack));
      continue;
    }

    throw new Error(`Invalid operator: ${token}`);
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
