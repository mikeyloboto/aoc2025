const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;
  const cleanData = data
    .trim()
    .split("\n")
    .map((row) => row.trim())
    .map((row) => row.split(/\s+/g));
  console.log(cleanData);

  const opRow = cleanData.splice(cleanData.length - 1)[0];

  console.log(cleanData, opRow);

  const results = [];

  for (let i = 0; i < opRow.length; i++) {
    const op = opRow[i];
    let val = op === "+" ? 0 : 1;
    for (const row of cleanData) {
      val = op === "+" ? val + +row[i] : val * +row[i];
    }
    results.push(val);
  }

  console.log(results.reduce((a, c) => a + c, 0));
});
