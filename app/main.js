const { search } = require('./regex');
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

