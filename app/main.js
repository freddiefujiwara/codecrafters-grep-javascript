function matchOne(pattern, input) {
  if (!pattern) return true;
  if (!input) return false;

  if (pattern === ".") {
    return true; // "." matches any single character
  } else if (pattern === "\\d") {
    return /\d/.test(input); // "\d" matches any digit
  } else if (pattern === "\\w") {
    return /\w/.test(input); // "\w" matches any word character (alphanumeric + underscore)
  } else if (pattern[0] === "[") {
    const setEnd = pattern.indexOf("]");
    if(pattern[1] === "^"){
      const charSet = pattern.slice(2, setEnd);
      return !charSet.includes(input); // Check if input's character is in the set
    }
    const charSet = pattern.slice(1, setEnd);
    return charSet.includes(input); // Check if input's character is in the set
  } else {
    return pattern === input; // direct character match
  }
}

function search(pattern, input) {
  if (pattern[0] === "^") {
    return match(pattern.slice(1), input);
  } else {
    return match(".*" + pattern, input);
  }
}

function match(pattern, input) {
  if (!pattern) return true;
  else if (!input && pattern === "$") return true;
  else if (pattern[1] === "?") {
    return matchQuestion(pattern, input);
  } else if (pattern[1] === "*") {
    return matchStar(pattern, input);
  } else if (pattern[1] === "+") {
    return matchPlus(pattern, input);
  } else if (pattern[0] === "(") {
    return matchGroup(pattern, input);
  } else if (pattern[0] === "\\") {
    return matchOne(pattern.slice(0, 2), input[0]) && match(pattern.slice(2), input.slice(1));
  } else if (pattern[0] === "[") {
    const setEnd = pattern.indexOf("]");
    return matchOne(pattern.slice(0, setEnd + 1), input[0]) && match(pattern.slice(setEnd + 1), input.slice(1));
  } else {
    return matchOne(pattern[0], input[0]) && match(pattern.slice(1), input.slice(1));
  }
}

function matchQuestion(pattern, input) {
  return (
    (matchOne(pattern[0], input[0]) && match(pattern.slice(2), input.slice(1))) ||
    match(pattern.slice(2), input)
  );
}

function matchStar(pattern, input) {
  return (
    (matchOne(pattern[0], input[0]) && match(pattern, input.slice(1))) ||
    match(pattern.slice(2), input)
  );
}

function matchPlus(pattern, input) {
  if (matchOne(pattern[0], input[0])) {
    return matchStar(pattern, input.slice(1));
  } else {
    return false;
  }
}

function matchPlus(pattern, input) {
  if (!input) return false;
  if (matchOne(pattern[0], input[0])) {
    // Continue to match the remaining part of the pattern after '+'
    return match(pattern.slice(2), input.slice(1)) || matchPlus(pattern, input.slice(1));
  } else {
    return false;
  }
}

function matchGroup(pattern, input) {
  const groupEnd = pattern.indexOf(")");
  const groupPattern = pattern.slice(1, groupEnd);
  if (pattern[groupEnd + 1] === "?") {
    const remainderPattern = pattern.slice(groupEnd + 2); // +2 needed to slice off the ')?'
    return (
      (match(groupPattern, input.slice(0, groupPattern.length)) &&
        match(remainderPattern, input.slice(groupPattern.length))) ||
      match(remainderPattern, input)
    );
  } else if (pattern[groupEnd + 1] === "*") {
    const remainderPattern = pattern.slice(groupEnd + 2); // +2 needed to slice off the ')*'
    return (
      (match(groupPattern, input.slice(0, groupPattern.length)) &&
        match(pattern, input.slice(groupPattern.length))) ||
      match(remainderPattern, input)
    );
  } else if (pattern[groupEnd + 1] === "+") {
    const remainderPattern = pattern.slice(groupEnd + 2); // +2 needed to slice off the ')+'
    return match(groupPattern, input.slice(0, groupPattern.length)) && matchPlus(groupPattern, input.slice(groupPattern.length));
  } else {
    const remainderPattern = pattern.slice(groupEnd + 1); // +1 needed to slice off the ')'
    return (
      match(groupPattern, input.slice(0, groupPattern.length)) &&
      match(remainderPattern, input.slice(groupPattern.length))
    );
  }
}
function main() {
  const pattern = process.argv[3];
  const input = require("fs").readFileSync(0, "utf-8").trim();

  if (process.argv[2] !== "-E") {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
  }
  console.log("Logs from your program will appear here");
  if (search(pattern,input)) {
    console.log("MATCH");
    process.exit(0);
  } else {
    console.log("UNMATCH");
    process.exit(1);
  }
}
main();
