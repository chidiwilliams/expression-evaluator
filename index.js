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
  return /[+\\\-/*<>=]/.test(char);
}

function parse(tokens) {}

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
