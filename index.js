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

function hasGreaterPrecedence(op1, op2) {
  return operatorPrecedence[op1] > operatorPrecedence[op2];
}

function hasEqualPrecedence(op1, op2) {
  return operatorPrecedence[op1] === operatorPrecedence[op2];
}

function isLeftAssociative(operator) {
  return ['+', '-', '/', '*'].includes(operator);
}

function evaluate(rpn) {}

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
