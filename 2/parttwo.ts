const fs = require("fs");

validate = (input: string) => {
  const len = input.length;
  for (let j = 1; j < len; j++) {
    if (len % j !== 0) continue;

    const iters = len / j;
    const strseg = input.substring(0, j);

    const arr = new Array(iters).fill(strseg).reduce((c, a) => `${a}${c}`, "");

    if (input === arr) {
      return true;
    }
  }
  return false;
};

fs.readFile("./input", "utf8", (err, data) => {
  if (!err) {
    const ranges = data.trim().split(",");
    const procRanges = ranges.map(
      (r) => r.split("-").map(Number) as [number, number],
    );
    console.log(procRanges);

    let totalSum = 0;

    for (const ran of procRanges) {
      for (let i = ran[0]; i <= ran[1]; i++) {
        const procStr = `${i}`;
        if (validate(procStr)) {
          totalSum += i;
          console.log({ match: procStr, runningSum: totalSum });
        }
      }
    }

    console.log(`Total  sum: ${totalSum}`);
  }
});
