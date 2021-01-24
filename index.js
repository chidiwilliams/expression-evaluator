function tokenize(input) {
  let scanner = 0;
  const tokens = [];

  while (scanner < input.length) {
    const char = input[scanner];

    if (isDigit(char)) {
      let str = '';
      let numberScanner = scanner;

      while (
        numberScanner < input.length &&
        isDigitOrDot(input[numberScanner])
      ) {
        str += input[numberScanner];
        numberScanner++;
      }

      const val = parseFloat(str);
      tokens.push(val);
      scanner = numberScanner;
    } else if (isSymbol(char)) {
      tokens.push(char);
      scanner++;
    } else if (char === ' ') {
      scanner++;
    } else {
      throw new Error(`Invalid token ${char} at position ${scanner}`);
    }
  }
  return tokens;
}

function isDigitOrDot(char) {
  return char === '.' || isDigit(char);
}

function isDigit(char) {
  const charCode = char.charCodeAt(0);
  return charCode >= 48 && charCode <= 57;
}

function isSymbol(char) {
  return /[+\-/*<>=(),]/.test(char);
}

function isOperator(char) {
  return /[+\-/*<>=]/.test(char);
}

function parse(tokens) {
  const operators = [];
  const out = [];

  tokens.forEach((token) => {
    if (typeof token === 'number') {
      out.push(token);
    } else if (isOperator(token)) {
      while (shouldUnwindOperatorStack(operators, token)) {
        out.push(operators.pop());
      }
      operators.push(token);
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators[operators.length - 1] !== '(') {
        out.push(operators.pop());
      }
      operators.pop();
    }
  });

  for (let i = operators.length - 1; i >= 0; i--) {
    out.push(operators[i]);
  }

  return out;
}

function shouldUnwindOperatorStack(operators, nextToken) {
  if (operators.length === 0) {
    return false;
  }

  const nextOperator = operators[operators.length - 1];
  return (
    hasGreaterPrecedence(nextOperator, nextToken) ||
    (hasEqualPrecedence(nextOperator, nextToken) &&
      isLeftAssociative(nextOperator))
  );
}

const operatorPrecedence = { '*': 2, '/': 2, '+': 1, '-': 1 };

function hasGreaterPrecedence(a, b) {
  return operatorPrecedence[a] > operatorPrecedence[b];
}

function hasEqualPrecedence(a, b) {
  return operatorPrecedence[a] === operatorPrecedence[b];
}

function isLeftAssociative(operator) {
  return isArithmeticOperator(operator);
}

function isArithmeticOperator(char) {
  return /[+\-/*]/.test(char);
}

function evaluate(rpn) {
  const stack = [];

  rpn.forEach((token) => {
    if (isOperator(token)) {
      operate(token, stack);
    } else if (typeof token === 'number') {
      stack.push(token);
    } else {
      throw new Error(`Invalid operator: ${operator}`);
    }
  });

  return stack.pop();
}

function operate(operator, stack) {
  const operands = [];

  for (let i = 0; i < getNumOperands(operator); i++) {
    operands.push(stack.pop());
  }

  let result;
  if (isArithmeticOperator(operator)) {
    result = operateArithmetic(operands[1], operands[0], operator);
  } else {
    throw new Error(`Invalid operator: ${operator}`);
  }

  stack.push(result);
  return stack;
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

function getNumOperands(operator) {
  if (isArithmeticOperator(operator)) {
    return 2;
  }
  throw new Error(`Invalid operator: ${operator}`);
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
