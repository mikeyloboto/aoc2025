const fs = require("fs");

maps = new Map<number, number[]>();

genMap = (len: number) => {
  const map = [];

  let divisors = [];
  for (let j = 1; j < len; j++) {
    if (len % j !== 0) continue;
    divisors.push(j);
  }
  for (const d of divisors) {
    map.push(
      `1${new Array(len / d - 1)
        .fill([...new Array(d - 1).fill(0), 1].join(""))
        .join("")}`,
    );
  }
  maps.set(len, map);
  return map;
};

validate = (input: number) => {
  const len = `${input}`.length;
  if (len === 1) return false;

  let map = [];

  if (maps.get(len)) map = maps.get(len);
  else {
    map = genMap(len);
  }

  for (const d of map) {
    if (input % d === 0) {
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

    // pregen maps
    for (let i = 2; i < 20; i++) {
      genMap(i);
    }

    console.time("proc");
    for (const ran of procRanges) {
      for (let i = ran[0]; i <= ran[1]; i++) {
        if (validate(i)) {
          totalSum += i;
          // console.log({ match: i, runningSum: totalSum });
        }
      }
    }
    console.timeEnd("proc");

    console.log(`Total  sum: ${totalSum}`);
  }
});
