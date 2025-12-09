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

  for (let i = 0; i < cleanData.length - 1; i++) {
    for (let j = i + 1; j < cleanData.length; j++) {
      const size =
        (Math.abs(cleanData[i][0] - cleanData[j][0]) + 1) *
        (Math.abs(cleanData[i][1] - cleanData[j][1]) + 1);
      if (size > maxRect) {
        maxRect = size;
      }
    }
  }
  console.log(maxRect);
});
