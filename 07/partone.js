const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;

  const cleanData = data.trim().split("\n");

  console.log(cleanData);

  let beams = [];

  const wid = cleanData[0].length;

  let splits = 0;

  for (const row of cleanData) {
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
    for (const s of splitters) {
      if (beams.includes(s)) {
        splits++;
        beams = beams.filter((b) => b !== s);
        if (s > 0) beams.push(s - 1);
        if (s < wid - 2) beams.push(s + 1);
      }
    }
  }

  console.log(beams, splits);
});
