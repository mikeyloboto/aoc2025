const fs = require("fs");

fs.readFile("./testinput", "utf8", (err, data) => {
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
        const len = procStr.length;
        if (len % 2 !== 0) continue;

        if (procStr.substring(0, len / 2) === procStr.substring(len / 2)) {
          console.log(`Invalid number: ${procStr}`);
          totalSum += i;
        }
      }
    }

    console.log(`Total  sum: ${totalSum}`);
  }
});
