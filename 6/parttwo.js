const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;
  const cleanData = data.trim().split("\n");

  // Last row has less chars? Oops accidental trim side effect. pad to compensate
  const ops = cleanData.splice(cleanData.length - 1)[0] + "     ";

  let nums = [];

  const results = [];

  for (let i = cleanData[0].length - 1; i >= 0; i--) {
    let num = "";
    for (const row of cleanData) {
      num += row[i];
    }
    num = num.trim();

    if (num !== "") nums.push(+num);

    if (ops[i].match(/[\+\*]/g)) {
      // do mafs

      results.push(
        nums.reduce(
          (a, c) => (ops[i] === "+" ? a + c : a * c),
          ops[i] === "+" ? 0 : 1,
        ),
      );

      nums = [];
    }
  }

  console.log(results.reduce((a, c) => a + c, 0));
});
