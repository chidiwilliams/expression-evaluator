// We'll set the default environment to contain a few handy math constants
const defaultEnvironment = { PI: Math.PI, E: Math.E };

// And then we'll initialize the current environment to the default...
let environment = { ...defaultEnvironment };

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

    if (/[+\-/*(),^<>=]/.test(char)) {
      tokens.push(char);
      scanner++;
      continue;
    }

    if (char === ' ') {
      scanner++;
      continue;
    }

    if (/[A-Z$#]/.test(char)) {
      let name = '';

      while (scanner < input.length && /[A-Z$#]/.test(input[scanner])) {
        name += input[scanner++];
      }

      tokens.push(name);
      continue;
    }

    throw new Error(`Invalid token ${char} at position ${scanner}`);
  }

  return tokens;
}
/**
 * Converts the tokens in infix notation to Reverse Polish notation
 */
function toRPN(tokens) {
  // First, we'll set up a stack to hold operators we're not yet ready to
  // add to the final expression
  const operators = [];

  // ...and an array to hold the final RPN expression
  const out = [];

  // For each token in the infix expression...
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // If the token is a number...
    if (typeof token === 'number' || /^[$#]/.test(token)) {
      // We'll push it to `out`
      out.push(token);
      continue;
    }

    // If the token is an operator...
    if (/[+\-/*<>=^]/.test(token)) {
      // While there are operators in the `operators` stack with a higher
      // precedence than the current token, we'll unwind them `operators` on to `out`
      while (shouldUnwindOperatorStack(operators, token)) {
        out.push(operators.pop());
      }

      // And then, push the current token to the `operators` stack
      operators.push(token);
      continue;
    }

    // If the token is a left parenthesis symbol...
    if (token === '(') {
      // We'll push it to the `operators` stack
      operators.push(token);
      continue;
    }

    // If the token is a right parenthesis symbol...
    if (token === ')') {
      // While there are operators in the `operators` stack, and we haven't reached the
      // last left parenthesis symbol, we'll unwind them on to `out`
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        out.push(operators.pop());
      }

      // We no longer need the left parenthesis symbol, so we'll discard it
      operators.pop();
      continue;
    }

    // If the token is a comma...
    if (token === ',') {
      // While there are operators in the `operators` stack, and we haven't reached the
      // last left parenthesis symbol, we'll unwind them on to `out`
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        out.push(operators.pop());
      }
      continue;
    }

    // If the token is a function name...
    if (/[A-Z]/.test(token)) {
      // We'll push it to the `operators` stack
      operators.push(token);
      continue;
    }

    // If we can't recognize the token, we'll throw an error
    throw new Error(`Unparsed token ${token} at position ${i}`);
  }

  // Finally we'll unwind all the remainin operators on to `out`
  for (let i = operators.length - 1; i >= 0; i--) {
    out.push(operators[i]);
  }

  // And then return `out`
  return out;
}

// Multiplication and division have higher precedence than addition and
// subtraction. We know this from BODMAS, PEMDAS, etc.
const precedence = { '*': 2, '/': 2, '+': 1, '-': 1 };

// Returns true if the topmost operator in the `operators` stack should be
// has a higher pre
function shouldUnwindOperatorStack(operators, nextToken) {
  if (operators.length === 0) {
    return false;
  }

  const lastOperator = operators[operators.length - 1];
  return (
    /[A-Z]/.test(lastOperator) ||
    precedence[lastOperator] >= precedence[nextToken]
  );
}

/**
 * Evaluates the RPN expression
 */
function evalRPN(rpn) {
  const stack = [];

  // For each token in the RPN expression...
  for (let i = 0; i < rpn.length; i++) {
    const token = rpn[i];

    // If the token is an operator...
    if (/[+\-/*^<>=]/.test(token)) {
      // Operate on the stack and push the result back on to the stack
      stack.push(operate(token, stack));
      continue;
    }

    // If the token is a variable...
    if (/\$/.test(token)) {
      // Dereference the variable: get its value from the environment and push it to the stack.
      // (Remove the "$" character first)
      stack.push(environment[token.slice(1)]);
      continue;
    }

    // If the token is a function name...
    if (/^[A-Z]/.test(token)) {
      // Apply the function on the stack and push the result to the stack
      stack.push(apply(token, stack));
      continue;
    }

    // If the token is a number or a variable pointer, push it to the stack
    stack.push(token);
  }

  // The value left on the stack is the final result of the evaluation
  return stack.pop();
}

/**
 * Returns the result of appyling the mathematical operator on the stack.
 * The operator here is either an arithmetic or a logical operator, so we
 * only need two operands from the stack for any operator.
 */
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
    case '<':
      return b < a;
    case '>':
      return b < a;
    case '=':
      return b === a;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}

/**
 * Returns the result of applying the function onto the stack.
 *
 * Functions may have any number of arguments. But each function must have a
 * definite number of arguments. i.e. X(a, b) and Y(a, b, c) are possible, but
 * X(a, b) and X(a, b, c) are not possible.
 *
 * The function arguments are in right-to-left order in the stack, i.e. the rightmost
 * argument is at the top of the stack, and so on.
 */
function apply(func, stack) {
  // MAX(a, b) returns the larger of a and b
  if (func === 'MAX') {
    const b = stack.pop();
    const a = stack.pop();
    return Math.max(a, b);
  }

  // SQRT(a) returns the square-root of a
  if (func === 'SQRT') {
    const a = stack.pop();
    return Math.sqrt(a);
  }

  // IF(a, b, c) returns b if a is true. Else, it returns c
  if (func === 'IF') {
    const ifFalse = stack.pop();
    const ifTrue = stack.pop();
    const predicate = stack.pop();
    return predicate ? ifTrue : ifFalse;
  }

  // SET(#a, b) sets the variable "a" to the value "b"
  if (func === 'SET') {
    const value = stack.pop();
    const key = stack.pop();
    environment[key.slice(1)] = value;
    return value;
  }

  // If we can't recognize the function, we'll throw an error
  throw new Error(`Undefined function: ${func}`);
}

/**
 * Finally, in the `evaluator` function, we'll link all stages
 * of the evaluation together.
 *
 * tokenize -> toRPN -> evalRPN
 */
function evaluate(input) {
  return evalRPN(toRPN(tokenize(input)));
}

/**
 * Resets the environment back to the default
 */
function reset() {
  environment = { ...defaultEnvironment };
}

module.exports = {
  tokenize,
  toRPN,
  evalRPN,
  evaluate,
  reset,
};
