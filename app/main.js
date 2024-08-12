function isAlphaNumeric(code) {
  return (code >= '0' && code <= '9') ||        // Numbers 0-9
    (code >= 'A' && code <= 'Z') ||        // Uppercase letters A-Z
    (code >= 'a' && code <= 'z');         // Lowercase letters a-z
}

function matchPattern(inputLine, pattern) {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  } else if(pattern.length === 2 && pattern.includes("d")){
    return inputLine.split('')
      .filter((d)=>{
        return d >= '0' && d <= '9'
      }).length > 0;
  } else if(pattern.length === 2 && pattern.includes("w")){
    return inputLine.split('')
      .filter((c)=>{
        return c === "_" || isAlphaNumeric(c)
      }).length > 0;
  } else if(pattern.length > 2 && pattern[0] === "[" && pattern[pattern.length - 1] === "]"){
    const targets = pattern.split('');
    targets.shift();
    targets.pop();
    if(targets[0] === "^"){
      return inputLine.split('')
        .filter((c)=>{
          return !targets.includes(c);
        }).length > 0;
    }
    return inputLine.split('')
      .filter((c)=>{
        return targets.includes(c);
      }).length > 0;
  } else {
    throw new Error(`Unhandled pattern ${pattern}`);
  }
}

function main() {
  const pattern = process.argv[3];
  const inputLine = require("fs").readFileSync(0, "utf-8").trim();

  if (process.argv[2] !== "-E") {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
  }

  // You can use print statements as follows for debugging, they'll be visible when running tests.
  console.log("Logs from your program will appear here");

  // Uncomment this block to pass the first stage
  if (matchPattern(inputLine, pattern)) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
