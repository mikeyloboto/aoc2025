const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;

  const cleanData = data.trim().split("\n");

  console.log(cleanData);

  let beams = [];

  const wid = cleanData[0].length;

  let splits = 0;

  let timelines = 0;

  for (const row of cleanData) {
    console.log(`${cleanData.indexOf(row)}/${row.length}`);
    const splitters = [];
    for (let i = 0; i < row.length; i++) {
      // keep all splitters in mind

      if (row[i] === "S") {
        // start of beam
        beams.push(i);
      }

      if (row[i] === "^") {
        // remember relevant splitter
        if (beams.includes(i)) splitters.push(i);
      }
    }

    // proc splits
    const removal = [];
    const adding = [];

    console.log(splitters);

    console.log(beams.length);

    if (splitters.length > 0)
      beams = beams.flatMap((b) => {
        if (splitters.includes(b)) {
          return [b - 1, b + 1];
        } else {
          return b;
        }
      });

    // then add queued
  }
  console.log(beams.length);
});
