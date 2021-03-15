function tokenize(input) {
  let scanner = 0;
  const tokens = [];

  while (scanner < input.length) {
    const char = input[scanner];

    if (/[0-9]/.test(char)) {
      let digits = '';

      while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
        digits += input[scanner++];
      }

      const number = parseFloat(digits);
      tokens.push(number);
      continue;
    }

    if (/[+\-/*()^]/.test(char)) {
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

function toRPN(tokens) {
  const operators = [];
  const out = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (typeof token === 'number') {
      out.push(token);
      continue;
    }

    if (/[+\-/*<>=^]/.test(token)) {
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
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        out.push(operators.pop());
      }
      operators.pop();
      continue;
    }

    throw new Error(`Unparsed token ${token} at position ${i}`);
  }

  for (let i = operators.length - 1; i >= 0; i--) {
    out.push(operators[i]);
  }

  return out;
}

const precedence = { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1 };

function shouldUnwindOperatorStack(operators, nextToken) {
  if (operators.length === 0) {
    return false;
  }

  const lastOperator = operators[operators.length - 1];
  return precedence[lastOperator] >= precedence[nextToken];
}

function evalRPN(rpn) {
  const stack = [];

  for (let i = 0; i < rpn.length; i++) {
    const token = rpn[i];

    if (/[+\-/*^]/.test(token)) {
      stack.push(operate(token, stack));
      continue;
    }

    // token is a number
    stack.push(token);
  }

  return stack.pop();
}

function operate(operator, stack) {
  const a = stack.pop();
  const b = stack.pop();

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

function evaluate(input) {
  return evalRPN(toRPN(tokenize(input)));
}

module.exports = {
  tokenize,
  toRPN,
  evalRPN,
  evaluate,
};
