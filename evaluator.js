/**
 * ####### #     # ######  ######  #######  #####   #####  ### ####### #     #
 * #        #   #  #     # #     # #       #     # #     #  #  #     # ##    #
 * #         # #   #     # #     # #       #       #        #  #     # # #   #
 * #####      #    ######  ######  #####    #####   #####   #  #     # #  #  #
 * #         # #   #       #   #   #             #       #  #  #     # #   # #
 * #        #   #  #       #    #  #       #     # #     #  #  #     # #    ##
 * ####### #     # #       #     # #######  #####   #####  ### ####### #     #
 *
 * ####### #     #    #    #       #     #    #    ####### ####### ######
 * #       #     #   # #   #       #     #   # #      #    #     # #     #
 * #       #     #  #   #  #       #     #  #   #     #    #     # #     #
 * #####   #     # #     # #       #     # #     #    #    #     # ######
 * #        #   #  ####### #       #     # #######    #    #     # #   #
 * #         # #   #     # #       #     # #     #    #    #     # #    #
 * #######    #    #     # #######  #####  #     #    #    ####### #     #
 */

// We'll set the default environment to contain a few handy math constants
const defaultEnvironment = {
  PI: Math.PI,
  E: Math.E,
};

// And then we'll initialize the current environment to the default
let environment = { ...defaultEnvironment };

/**
 * Returns an array of tokens from the input expression string.
 */
function tokenize(input) {
  // First, we'll initialize a `scanner` index to track how much
  // of the input string we've covered
  let scanner = 0;

  // We'll also need an array to put the tokens we find
  const tokens = [];

  // While we haven't reached the end of the input...
  while (scanner < input.length) {
    // Get the next character
    const char = input[scanner];

    // If the character is a number...
    if (/[0-9]/.test(char)) {
      // Create a string to hold all the digits in the number
      let digits = '';

      // While we have more digits (or a period) in the number and we haven't
      // gotten to the end of the input...
      while (scanner < input.length && /[0-9\.]/.test(input[scanner])) {
        // Collect all the digits
        digits += input[scanner++];
      }

      // Convert the digits to a number and push the number to the array of tokens
      const number = parseFloat(digits);
      tokens.push(number);
      continue;
    }

    // If the character is a symbol...
    if (/[+\-/*(),^<>=]/.test(char)) {
      // Push it to the array of tokens
      tokens.push(char);
      scanner++;
      continue;
    }

    // If the character is white space...
    if (char === ' ') {
      // Ignore it
      scanner++;
      continue;
    }

    // If the character is the first character of a name,
    // like the name of a function or variable or variable pointer
    if (/[A-Z$#]/.test(char)) {
      // Create a string to hold all the characters in the name
      let name = '';

      // While we have more characters that make up the name and we haven't
      // gotten to the end of the input...
      while (scanner < input.length && /[A-Z$#]/.test(input[scanner])) {
        // Collect all the characters in the name
        name += input[scanner++];
      }

      // Then push the full name to the array of tokens
      tokens.push(name);
      continue;
    }

    // If we can't recognize the character, we'll throw an error
    throw new Error(`Invalid token ${char} at position ${scanner}`);
  }

  // After collecting all the tokens in the expression, we'll return them
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

    // If the token is an operator or a function name...
    if (/[+\-/*<>=^A-Z]/.test(token)) {
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

    // If we can't recognize the token, we'll throw an error
    throw new Error(`Invalid token ${token}`);
  }

  // Finally we'll unwind all the remaining operators on to `out`
  for (let i = operators.length - 1; i >= 0; i--) {
    out.push(operators[i]);
  }

  // And then return `out`
  return out;
}

// BODMAS, PEMDAS
// Exponentiation > [multiplication, division] > [addition, subtraction]
const precedence = {
  '^': 3,
  '*': 2,
  '/': 2,
  '+': 1,
  '-': 1,
};

// Returns true if the topmost operator in the `operators` stack has a
// precedence higher than or equal to the precedence of `nextToken`
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
    if (/^\$/.test(token)) {
      // We'll try to get its value from the environment (remember to skip the '$' character)
      const value = environment[token.slice(1)];

      // If the variable has not been set in the environment, we'll throw an error
      if (value === undefined) {
        throw new Error(`${token} is undefined`);
      }

      // But if it has, we'll push the value to the stack
      stack.push(value);
      continue;
    }

    // If the token is a function name...
    if (/^[A-Z]/.test(token)) {
      // Apply the function on the stack and push the result to the stack
      stack.push(apply(token, stack));
      continue;
    }

    // If the token is a number or a variable pointer, push it to the stack
    if (typeof token === 'number' || /^\#/.test(token)) {
      stack.push(token);
      continue;
    }

    // If we can't recognize the token, we'll throw an error
    throw new Error(`Invalid token ${token}`);
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
  const b = stack.pop();
  const a = stack.pop();

  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    case '^':
      return Math.pow(a, b);
    case '<':
      return a < b;
    case '>':
      return a < b;
    case '=':
      return a === b;
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

  // SET(#a, b) sets the variable a to the value b
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
  environment,
};
