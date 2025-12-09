const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;
  const cleanData = data
    .trim()
    .split("\n")
    .map((row) => row.split(",").map(Number));
  const maxSize = cleanData.reduce(
    (a, c) => {
      return [Math.max(a[0], c[0]), Math.max(a[1], c[1])];
    },
    [0, 0],
  );

  let maxRect = 0;

  let sizes = [];

  console.time("calc sizes");
  for (let i = 0; i < cleanData.length - 1; i++) {
    for (let j = i + 1; j < cleanData.length; j++) {
      const size =
        (Math.abs(cleanData[i][0] - cleanData[j][0]) + 1) *
        (Math.abs(cleanData[i][1] - cleanData[j][1]) + 1);
      sizes.push({
        coords: { i, j },
        range: [
          Math.min(cleanData[i][0], cleanData[j][0]),
          Math.max(cleanData[i][0], cleanData[j][0]),
          Math.min(cleanData[i][1], cleanData[j][1]),
          Math.max(cleanData[i][1], cleanData[j][1]),
        ],
        size,
      });
    }
  }

  sizes = sizes.sort((a, b) => b.size - a.size);
  console.timeEnd("calc sizes");

  console.time("search");
  for (const ch of sizes) {
    let found = true;
    for (let i = 0; i < cleanData.length; i++) {
      const j = i === cleanData.length - 1 ? 0 : i + 1;
      // check if dot is within range
      if (
        cleanData[i][0] > ch.range[0] &&
        cleanData[i][0] < ch.range[1] &&
        cleanData[i][1] > ch.range[2] &&
        cleanData[i][1] < ch.range[3]
      ) {
        found = false;
        break;
      }
      // check if line is passing though range
      if (
        Math.min(cleanData[i][0], cleanData[j][0]) <= ch.range[0] &&
        Math.max(cleanData[i][0], cleanData[j][0]) >= ch.range[1] &&
        cleanData[i][1] > ch.range[2] &&
        cleanData[i][1] < ch.range[3] &&
        cleanData[j][1] > ch.range[2] &&
        cleanData[j][1] < ch.range[3]
      ) {
        found = false;
        break;
      }
      if (
        Math.min(cleanData[i][1], cleanData[j][1]) <= ch.range[2] &&
        Math.max(cleanData[i][1], cleanData[j][1]) >= ch.range[3] &&
        cleanData[i][0] > ch.range[0] &&
        cleanData[i][0] < ch.range[1] &&
        cleanData[j][0] > ch.range[0] &&
        cleanData[j][0] < ch.range[1]
      ) {
        found = false;
        break;
      }
    }

    // HOW THE F&%K DID THIS WORK

    if (found) {
      console.log("success: ", ch);
      break;
    }
  }
  console.timeEnd("search");
});
