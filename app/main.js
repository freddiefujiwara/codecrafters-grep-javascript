const isDigit = (char) => char >= "0" && char <= "9";
const isLetter = (char) =>
    (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
const isWordChar = (char) => isDigit(char) || isLetter(char) || char === "_";
const isInSet = (char, set) => set.includes(char);
const isExact = (char, exact) => char === exact;

const matchDigit = (input) => {
    const i = input.findIndex(isDigit);
    return [i, i];
};

const matchWordChar = (input) => {
    const i = input.findIndex(isWordChar);
    return [i, i];
};

const makeMatchSet = (set, negative) => (input) => {
    const i = input.findIndex((char) =>
          negative ? !isInSet(char, set) : isInSet(char, set)
        );
    return [i, i];
};

const makeMatchExact = (exact) => (input) => {
    const i = input.findIndex((char) => isExact(char, exact));
    return [i, i];
};

const makeMatcher = (pattern) => {
  let match;
  let matchType;
  if (pattern === "\\d") {
    match = matchDigit;
    matchType = "digit";
  } else if (pattern === "\\w") {
    match = matchWordChar;
    matchType = "word";
  } else if (pattern.startsWith("[") && pattern.endsWith("]")) {
    const negative = pattern[1] === "^";
    const set = pattern.slice(negative ? 2 : 1, pattern.length - 1);
    match = makeMatchSet(set,negative);
    matchType = "set";
  } else if (pattern.length === 1) {
    match = makeMatchExact(pattern);
    matchType = "exact";
  } else {
    throw new Error(`Unhandled pattern ${pattern}`);
  }
  return { exec: match, type: matchType};
};

const compile = (input) => {
  const matchers = [];
  let i = 0;
  const end = input.length;
  while (i < end) {
    let pattern;
    if (input[i] === "\\") {
      pattern = input.slice(i, i + 2);
    } else if (input[i] === "[") {
      const end = input.indexOf("]", i);
      pattern = input.slice(i, end + 1);
    } else {
      pattern = input[i];
    }
    i += pattern.length;
    matchers.push(makeMatcher(pattern));
  }
  return matchers;
}
function matchPattern(inputLine, matchers){
  let matchStart;
  let matchEnd;
  let offset = 0;
  const chars = inputLine.split("");
  for (const matcher of matchers) {
    if (offset > chars.length) {
      return false;
    }
    const input = chars.slice(offset);
    const match = matcher.exec(input);
    if (match === null) {
      return false;
    }
    matchEnd = match[1];
    matchStart = match[0];
    console.log({
      matchStart,
      matchEnd,
      offset,
      inputLine,
      input,
    });
    if (matchStart < 0) {
      return false;
    }
    offset += matchEnd + 1;
  }
  return true;
}
function main() {
  const pattern = process.argv[3];
  const input = require("fs").readFileSync(0, "utf-8").trim();

  if (process.argv[2] !== "-E") {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
  }

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  console.log("Logs from your program will appear here");

  // Uncomment this block to pass the first stage
  if (matchPattern(input, compile(pattern))) {
    console.log("MATCH");
    process.exit(0);
  } else {
    console.log("UNMATCH");
    process.exit(1);
  }
}

main();
